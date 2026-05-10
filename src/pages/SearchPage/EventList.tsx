import EventCard from 'src/pages/EventCard/EventCard';

import type { Filters as FiltersType } from "@pages/SearchPage/Filters";

import { useGetEvents } from '@api/events';

type Params = {
  query: string,
  filters: FiltersType
}

const EventList = ({ query, filters }: Params) => {

  const { data: response, isLoading } = useGetEvents({
    city: filters.locations[0] || undefined,
    category: filters.categories[0] || undefined,
  });

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  const events = response?.data ?? [];

  if (!response) {
    return (
      <section className="events-grid">
        <p>Backend not connected.</p>
      </section>
    );
  }

  if (response.status !== 200) {
    return (
      <section className="events-grid">
        <p>Something went wrong.</p>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="events-grid">
        <p>No events found.</p>
      </section>
    );
  }

  return (
    <section className="events-grid">

      {events.map(event => (
        <EventCard
          key={event.eventId}
          {...event}
        />
      ))}

    </section>
  );
};

export default EventList;
