import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import styles from "./CheckoutCompletePage.module.css";
import { type PaymentResponse, type OrderResponse } from "@api/orders";
import { useGetTicketListings, useGetEvents } from "@api/events";

type CheckoutState = {
  payment: PaymentResponse;
  order: OrderResponse;
} | null;

export default function CheckoutCompletePage() {
  const location = useLocation();
  const state = location.state as CheckoutState;
  const payment = state?.payment;
  const order = state?.order;

  const ticketListingsQuery = useGetTicketListings(undefined);
  const eventsQuery = useGetEvents({ size: 100 });

  const ticketListings = ticketListingsQuery.data?.status === 200 ? ticketListingsQuery.data.data : [];
  const events = eventsQuery.data?.status === 200 && eventsQuery.data.data.content
    ? eventsQuery.data.data.content
    : [];

  const ticketListingMap = useMemo(() => {
    return new Map(ticketListings.map((t) => [t.ticketListingId, t]));
  }, [ticketListings]);

  const eventMap = useMemo(() => {
    return new Map(events.map((e) => [e.eventId, e]));
  }, [events]);

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
            Order ID: <strong>{payment.orderId}</strong>
          </p>
        </div>

        {order?.items && order.items.length > 0 && (
          <div className={styles.ticketsCard}>
            <h2>Your tickets</h2>
            <div className={styles.ticketsList}>
              {order.items.map((item) => {
                const ticketListing = item.ticketListingId
                  ? ticketListingMap.get(item.ticketListingId)
                  : undefined;
                const event = ticketListing?.eventId
                  ? eventMap.get(ticketListing.eventId)
                  : undefined;

                return (
                  <div key={item.orderItemId} className={styles.ticketItem}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.ticketEvent}>
                        {event?.eventName ?? "Event"}
                      </span>
                      <span className={styles.ticketType}>
                        {ticketListing?.ticketType ?? `Ticket #${item.ticketListingId}`}
                      </span>
                      {event?.startDate && (
                        <span className={styles.ticketDate}>
                          {formatDate(event.startDate)}
                        </span>
                      )}
                    </div>
                    <div className={styles.ticketDetails}>
                      <span>{item.quantity}x</span>
                      <span>{formatPrice(item.unitPrice ?? 0)} {ticketListing?.currency ?? "NOK"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.customerCard}>
          <h2>Payment summary</h2>
          <div className={styles.infoGrid}>
            {order?.items && (
              <>
                <span>Tickets</span>
                <span>{order.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)}</span>
              </>
            )}
            {payment.amount !== undefined && (
              <>
                <span>Total paid</span>
                <span>{formatPrice(payment.amount)} {payment.currency ?? "NOK"}</span>
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
