import EventCard from 'src/pages/EventCard/EventCard';
import type { Filters as FiltersType } from "@pages/SearchPage/Filters";
import { useQuery } from '@tanstack/react-query';

type Event = {
  id: string;
  title: string;
  image: string;
  category: string;
  location: string;
  date: string;
  price: number;
};

async function typedFetch<T>(url: string, params?: Object, options?: RequestInit): Promise<T> {
  if (params) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    url = `${url}?${searchParams.toString()}`;
  }

  const response = await fetch(url, options);
  return response.json();
}

type Params = { query: string, filters: FiltersType }

const EventList = ({ query, filters }: Params) => {

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events', filters, query],
    queryFn: () =>
      typedFetch<Event[]>("/api/events", { ...filters, q: query })
  });

  if (isLoading) {
    return <p>Loading ...</p>
  }
  // TODO: temporary
  if (error) {
    return <p>{error.message}</p>
  }
  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <section className="events-grid">
      {events.map((event: Event) => (
        <EventCard
          key={event.id}
          href={`/events/${event.id}`}
          imgSrc={event.image}
          title={event.title}
          tags={[event.category, event.location]}
          date={event.date}
          price={event.price}
        />
      ))}
    </section>
  );
};

export default EventList;
