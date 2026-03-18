import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import EventCard from 'src/pages/EventCard/EventCard'
import { Link } from 'react-router-dom';
import ScrollToTop from "@utility/ScrollToTop";
import './Style.css'
import heroimage from '@assets/heroimage.jpg'
import FeaturedEventCard from 'src/pages/FeaturedEventCard/FeaturedEventCard';
import auroraconcert from "@assets/auroraconcert.jpg";

function App() {

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${query}`);
  };
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
          <EventCard href='/events/aurora-live-concert' imgSrc={auroraconcert} title="Aurora Live Concert" tags={["Conecert", "Bergen, Norway"]} date='Wed, 4. Mar 2026, 17:00' price={890} />
          <hr />
        </section>


      </div>


    </>
  )
}

export default App

