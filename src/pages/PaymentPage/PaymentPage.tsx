import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import appleLogo from "@assets/icons/apple_logo.svg";
import creditCardIcon from "@assets/icons/credit_card.svg";
import googlePayIcon from "@assets/icons/google_pay.svg";
import vippsIcon from "@assets/icons/vipps.svg";
import { useCreateOrder, usePayOrder } from "@api/orders";
import { useAuthContext } from "@utility/AuthContext";
import StateBanner from "@components/StateBanner/StateBanner";
import styles from "./PaymentPage.module.css";

type PaymentMethod = "card" | "gpay" | "applepay" | "vipps";

type OrderItem = {
  ticketListingId: number;
  quantity: number;
};

type PaymentOrderState = {
  eventId?: number;
  eventName: string;
  ticketCount: number;
  totalPrice: number;
  items: OrderItem[];
};

function extractErrorMessage(err: unknown, context: string): string {
  if (err instanceof Error) {
    return `${context}: ${err.message}`;
  }
  if (typeof err === "object" && err !== null) {
    const errObj = err as Record<string, unknown>;
    if ("data" in errObj && errObj.data) {
      return `${context}: ${String(errObj.data)}`;
    }
    if ("status" in errObj) {
      return `${context}: HTTP ${errObj.status}`;
    }
  }
  return `${context}: Unknown error`;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuthContext();
  const stateOrder = location.state as PaymentOrderState | null;

  const order = stateOrder;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [form, setForm] = useState({
    email: "",
    cardNumber: "",
    nameOnCard: "",
    expiryDate: "",
    cvv: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrderMutation = useCreateOrder();
  const payOrderMutation = usePayOrder();

  const formattedCardNumber = form.cardNumber.replace(/\s/g, "");
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isValidCardNumber = /^\d{16}$/.test(formattedCardNumber);
  const hasValidName = form.nameOnCard.trim().length > 0;
  const hasValidExpiryDate = /^\d{2}\s?\/\s?\d{2}$/.test(form.expiryDate);
  const hasValidCvv = /^\d{3,4}$/.test(form.cvv);
  const canPurchase =
    Boolean(order) &&
    isLoggedIn &&
    isValidEmail &&
    isValidCardNumber &&
    hasValidName &&
    hasValidExpiryDate &&
    hasValidCvv &&
    !isProcessing;

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiryDate(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 4);
    if (numbers.length <= 2) {
      return numbers;
    }
    return `${numbers.slice(0, 2)} / ${numbers.slice(2)}`;
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("nb-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canPurchase || !order || !isLoggedIn) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderItems = order.items.map((item) => ({
        ticketListingId: item.ticketListingId,
        quantity: item.quantity
      }));

      let createResponse;
      try {
        createResponse = await createOrderMutation.mutateAsync({
          data: { items: orderItems }
        });
      } catch (createErr) {
        throw new Error(extractErrorMessage(createErr, "Create order failed"));
      }

      if (createResponse.status !== 200) {
        throw new Error(`Create order failed: ${createResponse.data || "Unknown error"}`);
      }

      const orderId = createResponse.data.orderId;
      if (!orderId) {
        throw new Error("Create order failed: No order ID returned");
      }

      let payResponse;
      try {
        payResponse = await payOrderMutation.mutateAsync({
          id: orderId,
          data: { forceFailure: false }
        });
      } catch (payErr) {
        throw new Error(extractErrorMessage(payErr, "Payment failed"));
      }

      if (payResponse.status !== 200) {
        throw new Error(`Payment failed: ${payResponse.data || "Unknown error"}`);
      }

      navigate("/checkout-complete", {
        state: {
          orderId,
          orderNumber: createResponse.data.orderNumber,
          email: form.email,
          paymentMethod,
          cardLastFour: formattedCardNumber.slice(-4),
          eventId: order.eventId,
          eventName: order.eventName,
          ticketCount: order.ticketCount,
          totalPrice: order.totalPrice,
          paymentStatus: payResponse.data.status
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <StateBanner
        title="Login required"
        description="You must be logged in to complete your purchase."
      />
    );
  }

  if (!order) {
    return (
      <StateBanner
        title="No order found"
        description="Please go back to an event and select tickets first."
      />
    );
  }

  return (
    <main className={styles.paymentPage}>
      <section className={styles.paymentContent}>
        <div className={styles.orderCard}>
          <h2>Order</h2>
          <h3>{order.eventName}</h3>
          <p>
            {order.ticketCount} {order.ticketCount === 1 ? "ticket" : "tickets"} ·{" "}
            {formatPrice(order.totalPrice)} NOK
          </p>
        </div>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        <form className={styles.paymentForm} onSubmit={handleSubmit}>
          <div className={styles.paymentMethods}>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === "card" ? styles.activeMethod : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <img src={creditCardIcon} alt="" />
              <span>Card</span>
            </button>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === "gpay" ? styles.activeMethod : ""}`}
              onClick={() => setPaymentMethod("gpay")}
            >
              <img src={googlePayIcon} alt="" />
            </button>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === "applepay" ? styles.activeMethod : ""}`}
              onClick={() => setPaymentMethod("applepay")}
            >
              <img src={appleLogo} alt="" />
              <span>Pay</span>
            </button>
            <button
              type="button"
              className={`${styles.methodButton} ${paymentMethod === "vipps" ? styles.activeMethod : ""}`}
              onClick={() => setPaymentMethod("vipps")}
            >
              <img className={styles.vippsLogo} src={vippsIcon} alt="Vipps" />
            </button>
          </div>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              placeholder={user.email || "name@example.com"}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </label>
          <label>
            Card number
            <input
              inputMode="numeric"
              value={form.cardNumber}
              placeholder="1111 2222 3333 4444"
              onChange={(e) => updateField("cardNumber", formatCardNumber(e.target.value))}
            />
          </label>
          <label>
            Name on card
            <input
              value={form.nameOnCard}
              placeholder="First name Last name"
              onChange={(e) => updateField("nameOnCard", e.target.value)}
            />
          </label>
          <div className={styles.twoColumns}>
            <label>
              Expiry date
              <input
                inputMode="numeric"
                value={form.expiryDate}
                placeholder="MM / YY"
                onChange={(e) => updateField("expiryDate", formatExpiryDate(e.target.value))}
              />
            </label>
            <label>
              CVV
              <input
                inputMode="numeric"
                value={form.cvv}
                placeholder="123"
                maxLength={4}
                onChange={(e) => updateField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
              />
            </label>
          </div>
          <button type="submit" className={styles.purchaseButton} disabled={!canPurchase}>
            {isProcessing ? "Processing..." : "Purchase"}
          </button>
        </form>
      </section>
    </main>
  );
}
