import { useLocation } from "react-router-dom";
import styles from "./CheckoutCompletePage.module.css";
import { type PaymentResponse } from "@api/orders";

export default function CheckoutCompletePage() {
  const location = useLocation();
  const payment = location.state as PaymentResponse | null;

  console.log("CheckoutCompletePage received payment data:", payment);

  if (!payment?.orderId) {
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

  // const qrValue = JSON.stringify({
  //   orderId: order.orderId,
  //   orderNumber: order.orderNumber,
  //   email: order.email,
  //   eventName: order.eventName,
  //   ticketCount: order.ticketCount
  // });

  return (
    <main className={styles.checkoutPage}>
      <section className={styles.checkoutContent}>
        <div className={styles.confirmationText}>
          <h1>Thank you for your order!</h1>
          <p>
            Your order id <strong>{payment.orderId}</strong>
          </p>
          {/* <p> */}
          {/*   A confirmation email has been sent to <strong>{order.email}</strong> */}
          {/* </p> */}
          {/* {order.eventName && ( */}
          {/*   <p> */}
          {/*     Event: <strong>{order.eventName}</strong> */}
          {/*   </p> */}
          {/* )} */}
          {/* {order.ticketCount !== undefined && order.ticketCount > 0 && ( */}
          {/*   <p> */}
          {/*     Tickets: <strong>{order.ticketCount}</strong> */}
          {/*   </p> */}
          {/* )} */}
          {/* <h2>Your tickets:</h2> */}
          {/* <p style={{ color: "#b71c1c", fontWeight: "bold" }}> */}
          {/*   Note: This information will not be available if you refresh or revisit this page. */}
          {/* </p> */}
          {/* <p> */}
          {/*   Want to see all your purchased events?{" "} */}
          {/*   <Link to="/account" className={styles.accountLink}> */}
          {/*     Go to your account page */}
          {/*   </Link>. */}
          {/* </p> */}
        </div>
        {/* <div className={styles.qrCard} aria-label="Ticket QR code"> */}
        {/*   <QRCodeSVG */}
        {/*     value={qrValue} */}
        {/*     size={154} */}
        {/*     bgColor="#ffffff" */}
        {/*     fgColor="#050505" */}
        {/*     level="M" */}
        {/*     marginSize={0} */}
        {/*   /> */}
        {/* </div> */}
        <div className={styles.customerCard}>
          <h2>Customer information</h2>
          <div className={styles.infoGrid}>
            {/* <span>Contact information</span> */}
            {/* <span>{order.email}</span> */}
            {/* <span>Payment method</span> */}
            {/* <span className={styles.paymentMethod}> */}
            {/*   <img src={creditCardIcon} alt="" aria-hidden="true" /> */}
            {/*   {formatPaymentMethod(order.paymentMethod)} */}
            {/*   {order.cardLastFour ? ` ending in ${order.cardLastFour}` : ""} */}
            {/* </span> */}
            {payment.amount !== undefined && (
              <>
                <span>Total paid</span>
                <span>{formatPrice(payment.amount)} NOK</span>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// function formatPaymentMethod(method?: string) {
//   if (method === "gpay") return "Google Pay";
//   if (method === "applepay") return "Apple Pay";
//   if (method === "vipps") return "Vipps";
//   return "Card";
// }

function formatPrice(price: number) {
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}
