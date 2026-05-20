import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getGetEventByIdQueryOptions, getGetTicketListingsQueryOptions } from "@api/events";
import { useGetMyOrders, type OrderResponse } from "@api/orders";
import styles from "./MyEvents.module.css";
import MyEventsCard from "./MyEventsCard";

export default function MyEvents() {
  const {
    data: ordersResponse,
    isLoading: ordersLoading,
    isError: ordersError
  } = useGetMyOrders();

  const orders: OrderResponse[] =
    ordersResponse?.status === 200 ? ordersResponse.data : [];

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "PAID" || order.paymentStatus === "COMPLETED"
  );

  const ticketListingIds = useMemo(() => {
    const ids = new Set<number>();
    paidOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (item.ticketListingId != null) {
          ids.add(item.ticketListingId);
        }
      });
    });
    return [...ids];
  }, [paidOrders]);

  const { data: ticketListingsResponse, isLoading: listingsLoading } = useQuery({
    ...getGetTicketListingsQueryOptions({}),
    enabled: ticketListingIds.length > 0
  });

  const ticketListingToEventMap = useMemo(() => {
    const map = new Map<number, number>();
    if (ticketListingsResponse?.status === 200) {
      ticketListingsResponse.data.forEach((listing) => {
        if (listing.ticketListingId != null && listing.eventId != null) {
          map.set(listing.ticketListingId, listing.eventId);
        }
      });
    }
    return map;
  }, [ticketListingsResponse]);

  const uniqueEventIds = useMemo(() => {
    const ids = new Set<number>();
    paidOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (item.ticketListingId != null) {
          const eventId = ticketListingToEventMap.get(item.ticketListingId);
          if (eventId != null) {
            ids.add(eventId);
          }
        }
      });
    });
    return [...ids];
  }, [paidOrders, ticketListingToEventMap]);

  const eventQueries = useQueries({
    queries: uniqueEventIds.map((eventId) => getGetEventByIdQueryOptions(eventId))
  });

  const eventsLoading = eventQueries.some((query) => query.isLoading);
  const eventsError = eventQueries.some((query) => query.isError);

  const isLoading = ordersLoading || listingsLoading || eventsLoading;
  const isError = ordersError || eventsError;

  const eventMap = useMemo(() => {
    const map = new Map<number, { eventName?: string; startDate?: string; imageUrl?: string }>();
    eventQueries.forEach((query, index) => {
      const event = query.data?.data;
      if (typeof event === "object" && event !== null && "eventId" in event) {
        map.set(uniqueEventIds[index], {
          eventName: event.eventName,
          startDate: event.startDate,
          imageUrl: event.imageUrl
        });
      }
    });
    return map;
  }, [eventQueries, uniqueEventIds]);

  const today = new Date();

  const parsedEvents = useMemo(() => {
    const events: Array<{
      orderId: string;
      eventId: number;
      eventName: string;
      eventDate: string;
      ticketCount: number;
    }> = [];

    paidOrders.forEach((order) => {
      const orderEventCounts = new Map<number, number>();

      order.items?.forEach((item) => {
        if (item.ticketListingId != null) {
          const eventId = ticketListingToEventMap.get(item.ticketListingId);
          if (eventId != null) {
            const currentCount = orderEventCounts.get(eventId) || 0;
            orderEventCounts.set(eventId, currentCount + (item.quantity || 1));
          }
        }
      });

      orderEventCounts.forEach((ticketCount, eventId) => {
        const eventData = eventMap.get(eventId);
        if (eventData) {
          events.push({
            orderId: order.orderId || "",
            eventId,
            eventName: eventData.eventName || "Unknown Event",
            eventDate: eventData.startDate || order.createdAt || "",
            ticketCount
          });
        }
      });
    });

    return events;
  }, [paidOrders, ticketListingToEventMap, eventMap]);

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
              key={`${event.orderId}-${event.eventId}`}
              eventName={event.eventName}
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
              key={`${event.orderId}-${event.eventId}`}
              eventName={event.eventName}
              eventDate={event.eventDate}
              ticketCount={event.ticketCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
