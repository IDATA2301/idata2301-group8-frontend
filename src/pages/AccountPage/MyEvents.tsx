import { useQueries } from "@tanstack/react-query";
import { getGetEventByIdQueryOptions } from "@api/events";
import styles from "./MyEvents.module.css";
import MyEventsCard from "./MyEventsCard";

export default function MyEvents() {
  const mockOrders = [
    {
      eventId: 1,
      eventDate: "2026-08-15"
    },
    {
      eventId: 2,
      eventDate: "2024-01-10"
    }
  ];

  const eventQueries = useQueries({
    queries: mockOrders.map((order) => getGetEventByIdQueryOptions(order.eventId))
  });

  const isLoading = eventQueries.some((query) => query.isLoading);
  const isError = eventQueries.some((query) => query.isError);
  const today = new Date();

  const parsedEvents = eventQueries
    .map((query, index) => {
      const event = query.data?.data;

      if (
        typeof event !== "object" ||
        event === null ||
        !("eventId" in event)
      ) {
        return null;
      }

      return {
        ...event,
        eventDate: mockOrders[index].eventDate
      };
    })
    .filter((event): event is NonNullable<typeof event> => event !== null);

  const ongoingEvents = parsedEvents.filter(
    (event) => new Date(event.eventDate) >= today
  );

  const expiredEvents = parsedEvents.filter(
    (event) => new Date(event.eventDate) < today
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
