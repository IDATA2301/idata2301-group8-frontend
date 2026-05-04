import { useGetEvents } from '@api/events';
import type { EventResponse } from '@api/events';
import EventCard from '@pages/EventCard/EventCard';

export default function EventCards() {
  const { data: response, isLoading, error } = useGetEvents();

  const events: EventResponse[] = Array.isArray(response?.data)
    ? response.data
    : [];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <>
      {events.map((event) => (
        <EventCard
          key={event.slug}
          href={`/events/${event.slug}`}
          imgSrc={`/images/${event.slug}.jpg`}
          title={event.eventName ?? "No title"}
          tags={event.categoryNames ?? []}
          date={"TBA"}
          price={0}
        />
      ))}
    </>
  );
}
