import { useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import creditCardIcon from "@assets/icons/credit_card.svg";
import styles from "./CheckoutCompletePage.module.css";

type CheckoutState = {
  orderId?: string;
  orderNumber?: string;
  email?: string;
  paymentMethod?: string;
  cardLastFour?: string;
  eventId?: number;
  eventName?: string;
  ticketCount?: number;
  totalPrice?: number;
  paymentStatus?: string;
};

export default function CheckoutCompletePage() {
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  if (!state?.orderNumber || !state.email || !state.cardLastFour) {
    return (
      <main className={styles.checkoutPage}>
        <section className={styles.checkoutContent}>
          <div className={styles.confirmationText}>
            <h1>No completed order found</h1>
            <p>Please complete payment before opening this page.</p>
          </div>
        </section>
      </main>
    );
  }

  const order = {
    orderId: state.orderId,
    orderNumber: state.orderNumber,
    email: state.email,
    paymentMethod: state.paymentMethod,
    cardLastFour: state.cardLastFour,
    eventName: state.eventName,
    ticketCount: state.ticketCount,
    totalPrice: state.totalPrice
  };

  const qrValue = JSON.stringify({
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    email: order.email,
    eventName: order.eventName,
    ticketCount: order.ticketCount
  });

  return (
    <main className={styles.checkoutPage}>
      <section className={styles.checkoutContent}>
        <div className={styles.confirmationText}>
          <h1>Thank you for your order!</h1>
          <p>
            Your order number is <strong>{order.orderNumber}</strong>
          </p>
          <p>
            A confirmation email has been sent to <strong>{order.email}</strong>
          </p>
          {order.eventName && (
            <p>
              Event: <strong>{order.eventName}</strong>
            </p>
          )}
          {order.ticketCount && order.ticketCount > 0 && (
            <p>
              Tickets: <strong>{order.ticketCount}</strong>
            </p>
          )}
          <h2>Your tickets:</h2>
        </div>
        <div className={styles.qrCard} aria-label="Ticket QR code">
          <QRCodeSVG
            value={qrValue}
            size={154}
            bgColor="#ffffff"
            fgColor="#050505"
            level="M"
            includeMargin={false}
          />
        </div>
        <div className={styles.customerCard}>
          <h2>Customer information</h2>
          <div className={styles.infoGrid}>
            <span>Contact information</span>
            <span>{order.email}</span>
            <span>Payment method</span>
            <span className={styles.paymentMethod}>
              <img src={creditCardIcon} alt="" aria-hidden="true" />
              {formatPaymentMethod(order.paymentMethod)} ending in {order.cardLastFour}
            </span>
            {order.totalPrice !== undefined && (
              <>
                <span>Total paid</span>
                <span>{formatPrice(order.totalPrice)} NOK</span>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function formatPaymentMethod(method?: string) {
  if (method === "gpay") return "Google Pay";
  if (method === "applepay") return "Apple Pay";
  if (method === "vipps") return "Vipps";
  return "Card";
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}
