import { useNavigate, Link } from 'react-router-dom';

import FeaturedEventCard from 'src/pages/FeaturedEventCard/FeaturedEventCard';
import EventCards from '@pages/HomePage/EventCards';

import ScrollToTop from "@utility/ScrollToTop";

import './style.css';

import heroimage from '@assets/heroimage.jpg';

import { useState } from 'react';

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

      <div
        className="hero-image-home"
        style={{ backgroundImage: `url(${heroimage})` }}
      >

        <main>

          <h1 className="hero-title">

            Your Gateway to <br />

            <span className="highlight">
              Unforgettable
            </span>{" "}

            Events

          </h1>

          <form
            className="search-container"
            onSubmit={handleSearch}
          >

            <input
              placeholder="Search city, dates, events"
              type="text"
              className="search-bar"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
            />

            <button
              type="submit"
              className="search-button"
            >
              Search
            </button>

          </form>

        </main>

      </div>

      <div className="page-container">

        <section>

          <h2 className="section-title">
            Categories
          </h2>

          <ul className="categories">

            <li>
              <Link
                className="category-card festivals"
                to="/category/festivals"
              >
                Festivals
              </Link>
            </li>

            <li>
              <Link
                className="category-card concerts"
                to="/category/concerts"
              >
                Concerts
              </Link>
            </li>

            <li>
              <Link
                className="category-card sport"
                to="/category/sport"
              >
                Sport
              </Link>
            </li>

            <li>
              <Link
                className="category-card museums"
                to="/category/museums"
              >
                Museums
              </Link>
            </li>

            <li>
              <Link
                className="category-card theaters"
                to="/category/theaters"
              >
                Theaters
              </Link>
            </li>

          </ul>

        </section>

        <section>

          <h2 className="section-title">
            Featured
          </h2>

          <FeaturedEventCard />

          <hr />

        </section>

        <section>

          <h2 className="section-title">
            Upcoming
          </h2>

          <EventCards />

          <hr />

        </section>

      </div>
    </>
  );
}

export default App;
