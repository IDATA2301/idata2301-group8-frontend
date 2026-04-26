import { useNavigate } from 'react-router-dom';
import EventCard from 'src/pages/EventCard/EventCard'
import { Link } from 'react-router-dom';
import ScrollToTop from "@utility/ScrollToTop";
import './Style.css'
import heroimage from '@assets/heroimage.jpg'
import FeaturedEventCard from 'src/pages/FeaturedEventCard/FeaturedEventCard';
import auroraconcert from "@assets/auroraconcert.jpg";
import { useEffect, useState } from 'react';
import { fetchEvents } from '../../api/events'; // adjust path if needed

function App() {

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${query}`);
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        console.log(data);
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <>
      <ScrollToTop />

      <div className="hero-image-home" style={{ backgroundImage: `url(${heroimage})` }}>

        <main>
          <h1>
            Your Gateway to <br />
            <span className="highlight">Unforgettable</span> Events
          </h1>

          <form className="search-container" onSubmit={handleSearch}>
            <input placeholder="Search city, dates, events" type="text"
              className="search-bar" value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </main>

      </div>

      <div className="page-container">
        <section>
          <h2>Categories</h2>

          <ul className="categories">
            <li>
              <Link className="category-card festivals" to="/category/festivals">
                Festivals
              </Link>
            </li>

            <li>
              <Link className="category-card concerts" to="/category/concerts">
                Concerts
              </Link>
            </li>

            <li>
              <Link className="category-card sport" to="/category/sport">
                Sport
              </Link>
            </li>

            <li>
              <Link className="category-card museums" to="/category/museums">
                Museums
              </Link>
            </li>

            <li>
              <Link className="category-card theaters" to="/category/theaters">
                Theaters
              </Link>
            </li>
          </ul>

        </section>


        <section>
          <h2>Featured</h2>
          <FeaturedEventCard />
          <hr />
        </section>


        <section>
          <h2>Upcoming</h2>

          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}

          {events.map((event) => (
            <EventCard
              key={event.slug}
              href={`/events/${event.slug}`}
              imgSrc={`/images/${event.slug}.jpg`}
              title={event.title}
              tags={["Event"]}   // temporary
              date={"TBA"}       // temporary
              price={0}          // temporary
            />
          ))}

          <hr />
        </section>

      </div>


    </>
  )
}

export default App

