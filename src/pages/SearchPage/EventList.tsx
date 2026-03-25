import EventCard from 'src/pages/EventCard/EventCard';

type Event = {
  id: string;
  title: string;
  image: string;
  category: string;
  location: string;
  date: string;
  price: number;
};

const EventList = ({ events }: { events: Event[] }) => {

  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <section className="events-grid">
      {events.map(event => (
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
