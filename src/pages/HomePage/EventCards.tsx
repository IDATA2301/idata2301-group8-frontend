import type { EventResponse } from "@api/events";

import EventCard from "@pages/EventCard/EventCard";

type Props = {
  events: EventResponse[];
};

export default function EventCards({ events }: Props) {
  if (events.length === 0) {
    return <p>No upcoming events available.</p>;
  }

  return (
    <div className="upcoming-events-scroll">
      {events.map((event) => (
        <EventCard
          key={event.eventId ?? event.slug}
          {...event}
        />
      ))}
    </div>
  );
}
