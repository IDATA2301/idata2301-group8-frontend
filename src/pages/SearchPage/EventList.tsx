import EventCard from 'src/pages/EventCard/EventCard';
import type { Filters as FiltersType } from "@pages/SearchPage/Filters";
import { useGetEvents } from '@api/events';

type Params = { query: string, filters: FiltersType }

const EventList = ({ query, filters }: Params) => {

  const { data: response, isLoading } = useGetEvents({
    city: filters.locations[0] || undefined,
    category: filters.categories[0] || undefined,
  });

  if (isLoading) {
    return <p>Loading ...</p>
  }

  if (!response || response.status !== 200) {
    return <p>Something went wrong</p>;
  }

  if (response.data.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <section className="events-grid">
      {response.data.map(event => (
        <EventCard key={event.eventId} {...event} />
      ))}
    </section>
  );
};

export default EventList;
