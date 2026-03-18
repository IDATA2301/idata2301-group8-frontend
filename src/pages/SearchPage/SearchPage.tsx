import { useLocation } from 'react-router-dom';
import { useState } from 'react';

import EventCard from 'src/pages/EventCard/EventCard';
import auroraconcert from "@assets/auroraconcert.jpg";

import './Style.css';

function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryParam = params.get('q') || '';

  const [query, setQuery] = useState(queryParam);

  return (
    <div className="search-page">

      <div className="search-header">
        <form className="search-bar-container">
          <input className="search-page-bar"
            type="text"
            placeholder="Search city, dates, events"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
          />
          <button className="search-page-button" type="submit">Search</button>
        </form>
      </div>

      <div className="results-bar">
        <p>
          Search results for <span>"{queryParam}"</span>
        </p>

        <button className="sort-button">
          Sort
        </button>
      </div>

      <div className="search-content">

        <div className="filters">
          <h2>Filter</h2>

          <div className="filter-section">
            <div className="filter-header">
              <h3>Category</h3>
            </div>

            <label className="filter-item">
              <span>Music festival</span>
              <input type="checkbox" />
            </label>

            <label className="filter-item">
              <span>Sports</span>
              <input type="checkbox" />
            </label>

            <label className="filter-item">
              <span>Comedy Show</span>
              <input type="checkbox" />
            </label>
          </div>

          <div className="filter-section">
            <h3>Date</h3>

            <div className="date-input">
              <label>Event start after</label>
              <input type="date" />
            </div>

            <div className="date-input">
              <label>Event end after</label>
              <input type="date" />
            </div>
          </div>

          <div className="filter-section">
            <h3>Price</h3>

            <div className="price-inputs">
              <input type="number" placeholder="0 kr" />
              <input type="number" placeholder="9999 kr" />
            </div>
          </div>

          <div className="filter-section">
            <h3>Location</h3>

            <label className="filter-item">
              <span>Oslo</span>
              <input type="checkbox" />
            </label>

            <label className="filter-item">
              <span>Bergen</span>
              <input type="checkbox" />
            </label>
          </div>
        </div>

        <section className="events-grid">
          <EventCard
            href="/events/aurora-live-concert"
            imgSrc={auroraconcert}
            title="Aurora Live Concert"
            tags={["Concert", "Bergen, Norway"]}
            date="Wed, 4. Mar 2026, 17:00"
            price={890}
          />

          <EventCard
            href="/events/aurora-live-concert"
            imgSrc={auroraconcert}
            title="Aurora Live Concert"
            tags={["Concert", "Bergen, Norway"]}
            date="Wed, 4. Mar 2026, 17:00"
            price={890}
          />

          <EventCard
            href="/events/aurora-live-concert"
            imgSrc={auroraconcert}
            title="Aurora Live Concert"
            tags={["Concert", "Bergen, Norway"]}
            date="Wed, 4. Mar 2026, 17:00"
            price={890}
          />
        </section>

      </div>
    </div>
  );
}

export default SearchPage;
