import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import appleLogo from "@assets/icons/apple_logo.svg";
import creditCardIcon from "@assets/icons/credit_card.svg";
import googlePayIcon from "@assets/icons/google_pay.svg";
import vippsIcon from "@assets/icons/vipps.svg";
import { usePayOrder, type OrderResponse } from "@api/orders";
import { useAuthContext } from "@utility/AuthContext";
import StateBanner from "@components/StateBanner/StateBanner";
import styles from "./PaymentPage.module.css";
import toast from "@components/Toast";

type PaymentMethod = "card" | "gpay" | "applepay" | "vipps";

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
  const { isLoggedIn, user } = useAuthContext();
  const isSubmittingRef = useRef(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [form, setForm] = useState({
    email: user?.email || "",
    cardNumber: "",
    nameOnCard: "",
    expiryDate: "",
    cvv: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const payOrderMutation = usePayOrder();
  const formattedCardNumber = form.cardNumber.replace(/\s/g, "");
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isValidCardNumber = /^\d{16}$/.test(formattedCardNumber);
  const hasValidName = form.nameOnCard.trim().length > 0;
  const hasValidExpiryDate = /^\d{2}\s?\/\s?\d{2}$/.test(form.expiryDate);
  const hasValidCvv = /^\d{3,4}$/.test(form.cvv);
  const requiresCardDetails = paymentMethod === "card";
  const hasValidCardDetails =
    isValidCardNumber &&
    hasValidName &&
    hasValidExpiryDate &&
    hasValidCvv;
  const canPurchase =
    isLoggedIn &&
    isValidEmail &&
    (!requiresCardDetails || hasValidCardDetails) &&
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
    if (isSubmittingRef.current || !canPurchase || !isLoggedIn) {
      return;
    }

    isSubmittingRef.current = true;
    setIsProcessing(true);
    setError(null);

    try {
      const payResponse = await payOrderMutation.mutateAsync({
        id: ticketReservation.orderId!,
        data: { forceFailure: false }
      });

      if (payResponse.status !== 200) {
        toast.error("Payment failed. Please try again.");
        return;
      } else {
        toast.success("Payment successful!");
      }

      navigate("/checkout-complete", {
        state: {
          payment: payResponse.data,
          order: ticketReservation
        }
      });
    } catch (err) {
      setError(extractErrorMessage(err, "Payment failed"));
    } finally {
      isSubmittingRef.current = false;
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


  const data = localStorage.getItem("checkoutData");
  if (!data) {
    return (
      <StateBanner
        title="No order found"
        description="Please go back to an event and select tickets first."
      />
    );
  }

  const ticketReservation: OrderResponse = JSON.parse(data);
  if (ticketReservation.expiresAt && new Date(ticketReservation.expiresAt) < new Date()) {
    return (
      <StateBanner
        title="Reservation expired"
        description="Your ticket reservation has expired. Please go back to the event and select your tickets again."
      />
    );
  }

  if (ticketReservation.orderId === undefined || ticketReservation.items === undefined) {
    return (
      <StateBanner
        title="Invalid reservation"
        description="There was an issue with your ticket reservation. Please go back to the event and select your tickets again."
      />
    );
  }

  const ticketCount = ticketReservation.items.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  return (
    <main className={styles.paymentPage}>
      <section className={styles.paymentContent}>
        <div className={styles.orderCard}>
          <h2>Order</h2>
          <h3>{ticketReservation.orderNumber}</h3>
          {ticketReservation.items.map((item) => (
            <div key={item.ticketListingId} className={styles.orderItem}>
              <span>Ticket listing #{item.ticketListingId}</span>
              <span>Quantity: {item.quantity}</span>
            </div>
          ))}
          <p>
            {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"} ·{" "}
            {formatPrice(ticketReservation.totalAmount || 0)} NOK
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
          {paymentMethod === "card" && (
            <>
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
            </>
          )}
          <button type="submit" className={styles.purchaseButton} disabled={!canPurchase}>
            {isProcessing ? "Processing..." : "Purchase"}
          </button>
        </form>
      </section>
    </main>
  );
}
