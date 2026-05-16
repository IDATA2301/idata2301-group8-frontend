import { useQueries } from "@tanstack/react-query";
import { getGetEventByIdQueryOptions } from "@api/events";
// import { useGetMyOrders, type OrderResponse } from "@api/orders";
import styles from "./MyEvents.module.css";
import MyEventsCard from "./MyEventsCard";

type OrderResponse = {
  orderId?: number;
  eventId?: number;
  eventDate?: string;
  ticketCount?: number;
};

export default function MyEvents() {
  // TODO: Uncomment when order-service is ready and generated with Orval.
  // const {
  //   data: ordersResponse,
  //   isLoading: ordersLoading,
  //   isError: ordersError
  // } = useGetMyOrders();

  // TODO: Replace this with ordersResponse?.status === 200 ? ordersResponse.data : []
  // when order-service is ready.
  const orders: OrderResponse[] = [];

  const validOrders = orders.filter(
    (order): order is OrderResponse & { eventId: number } => order.eventId != null
  );

  const eventQueries = useQueries({
    queries: validOrders.map((order) => getGetEventByIdQueryOptions(order.eventId))
  });

  const isLoading =
    // ordersLoading ||
    eventQueries.some((query) => query.isLoading);

  const isError =
    // ordersError ||
    eventQueries.some((query) => query.isError);

  const today = new Date();

  const parsedEvents = eventQueries
    .map((query, index) => {
      const event = query.data?.data;
      const order = validOrders[index];

      if (
        typeof event !== "object" ||
        event === null ||
        !("eventId" in event)
      ) {
        return null;
      }

      return {
        ...event,
        eventDate: order.eventDate ?? event.startDate ?? "",
        ticketCount: order.ticketCount ?? 0
      };
    })
    .filter((event): event is NonNullable<typeof event> => event !== null);

  const ongoingEvents = parsedEvents.filter(
    (event) => event.eventDate && new Date(event.eventDate) >= today
  );

  const expiredEvents = parsedEvents.filter(
    (event) => event.eventDate && new Date(event.eventDate) < today
  );

  return (
    <div className={styles.eventsContainer}>
      <div className={styles.eventsSection}>
        <h2>Ongoing Events</h2>
        <div className={styles.eventsScrollBox}>
          {isLoading && (
            <div className={styles.placeholderBox}>
              Loading events...
            </div>
          )}
          {isError && (
            <div className={styles.placeholderBox}>
              Failed to load events
            </div>
          )}
          {!isLoading && !isError && ongoingEvents.length === 0 && (
            <div className={styles.placeholderBox}>
              No ongoing events
            </div>
          )}
          {ongoingEvents.map((event) => (
            <MyEventsCard
              key={event.eventId}
              eventName={event.eventName ?? ""}
              eventDate={event.eventDate}
              ticketCount={event.ticketCount}
            />
          ))}
        </div>
      </div>
      <div className={styles.eventsSection}>
        <h2>Expired Events</h2>
        <div className={styles.eventsScrollBox}>
          {isLoading && (
            <div className={styles.placeholderBox}>
              Loading events...
            </div>
          )}
          {isError && (
            <div className={styles.placeholderBox}>
              Failed to load events
            </div>
          )}
          {!isLoading && !isError && expiredEvents.length === 0 && (
            <div className={styles.placeholderBox}>
              No expired events
            </div>
          )}
          {expiredEvents.map((event) => (
            <MyEventsCard
              key={event.eventId}
              eventName={event.eventName ?? ""}
              eventDate={event.eventDate}
              ticketCount={event.ticketCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
