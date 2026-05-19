import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
// import FeaturedEventCard from "src/pages/FeaturedEventCard/FeaturedEventCard";
import EventCards from "@pages/HomePage/EventCards";
import EventCardLoader from "@components/EventCardLoader/EventCardLoader";
import ScrollToTop from "@utility/ScrollToTop";
import { useGetEvents, type EventResponse } from "@api/events";
import { usePrefetchSearch } from "@utility/usePrefetchSearch";
import heroimage from "@assets/heroimage.jpg";
import festivalsImage from "@assets/categoryimage/festival.jpg";
import concertsImage from "@assets/categoryimage/concert.jpg";
import sportImage from "@assets/categoryimage/sport.jpg";
import museumsImage from "@assets/categoryimage/museum.jpg";
import theatersImage from "@assets/categoryimage/theater.jpg";
import "./style.css";

const categories = [
  {
    name: "Festival",
    path: "/search?category=Festival",
    className: "festivals",
    image: festivalsImage
  },
  {
    name: "Concert",
    path: "/search?category=Concert",
    className: "concerts",
    image: concertsImage
  },
  {
    name: "Sports",
    path: "/search?category=Sports",
    className: "sport",
    image: sportImage
  },
  {
    name: "Exhibition",
    path: "/search?category=Exhibition",
    className: "museums",
    image: museumsImage
  },
  {
    name: "Theater",
    path: "/search?category=Theater",
    className: "theaters",
    image: theatersImage
  }
];

function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { prefetch } = usePrefetchSearch();

  const {
    data: eventsResponse,
    isLoading,
    isError
  } = useGetEvents({ filter: {} });

  const events: EventResponse[] = Array.isArray(eventsResponse?.data?.content)
    ? eventsResponse.data.content
    : [];

  // const featuredEvent = events[0];
  // const upcomingEvents = events.slice(1);
  const upcomingEvents = events;

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
              onFocus={() => prefetch()}
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
            {categories.map((category) => {
              const categoryParam = new URLSearchParams(category.path.split("?")[1]).get("category");
              return (
                <li key={category.name}>
                  <Link
                    className={`category-card ${category.className}`}
                    to={category.path}
                    style={{ backgroundImage: `url(${category.image})` }}
                    onMouseEnter={() => prefetch({ filter: { category: categoryParam ?? undefined } })}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/*
        <section>
          <h2 className="section-title">
            Featured
          </h2>

          {isLoading && <p>Loading featured event...</p>}
          {isError && <p>Could not load featured event.</p>}

          {!isLoading && !isError && featuredEvent && (
            <FeaturedEventCard event={featuredEvent} />
          )}

          {!isLoading && !isError && !featuredEvent && (
            <p>No featured event available.</p>
          )}

          <hr />
        </section>
        */}

        <section>
          <h2 className="section-title">
            Upcoming
          </h2>

          <div className="upcoming-events-content">
            {isLoading && (
              <div className="upcoming-events-loader">
                {Array.from({ length: 5 }).map((_, index) => (
                  <EventCardLoader key={index} />
                ))}
              </div>
            )}

            {isError && (
              <div className="upcoming-events-message">
                Could not load events.
              </div>
            )}

            {!isLoading && !isError && upcomingEvents.length > 0 && (
              <EventCards events={upcomingEvents} />
            )}

            {!isLoading && !isError && upcomingEvents.length === 0 && (
              <div className="upcoming-events-message">
                No upcoming events available.
              </div>
            )}
          </div>

          <hr />
        </section>
      </div>
    </>
  );
}

export default HomePage;
