import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import EventCards from "@pages/HomePage/EventCards";
import EventCardLoader from "@components/EventCardLoader/EventCardLoader";
import ScrollToTop from "@utility/ScrollToTop";
import { useGetEvents, type EventResponse } from "@api/events";
import { usePrefetchSearch } from "@utility/usePrefetchSearch";
import { usePrefetchEvent } from "@utility/usePrefetchEvent";
import heroimage from "@assets/heroimage.jpg";
import festivalsImage from "@assets/categoryimage/festival.jpg";
import concertsImage from "@assets/categoryimage/concert.jpg";
import sportImage from "@assets/categoryimage/sport.jpg";
import museumsImage from "@assets/categoryimage/museum.jpg";
import theatersImage from "@assets/categoryimage/theater.jpg";
import fallbackEventImage from "@assets/fallback-image.png";
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
  const { prefetch: prefetchEvent } = usePrefetchEvent();
  const currentTime = useMemo(() => new Date().toISOString(), []);

  const {
    data: eventsResponse,
    isLoading,
    isError
  } = useGetEvents({
    startDate: currentTime,
    sort: "startDate,asc",
    size: 6
  });

  const events: EventResponse[] =
    eventsResponse?.status === 200 && Array.isArray(eventsResponse.data.content)
      ? eventsResponse.data.content
      : [];

  const nextEvent = events[0];
  const upcomingEvents = events.slice(1);

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
                    onMouseEnter={() =>
                      prefetch({
                        category: categoryParam ? [categoryParam] : undefined
                      })
                    }
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="section-title">
            Next event
          </h2>

          <div className="next-event-content">
            {isLoading && (
              <div className="next-event-loader" />
            )}

            {isError && (
              <div className="next-event-message">
                Could not load event.
              </div>
            )}

            {!isLoading && !isError && nextEvent && (
              <Link
                to={`/events/${nextEvent.slug}`}
                className="next-event-card"
                onMouseEnter={() => nextEvent.slug && prefetchEvent(nextEvent.slug)}
              >
                <img
                  src={nextEvent.imageUrl || fallbackEventImage}
                  alt={nextEvent.eventName ?? "Event image"}
                  className="next-event-image"
                />
                <div className="next-event-info">
                  <h3 className="next-event-title">{nextEvent.eventName}</h3>
                  <div className="next-event-details">
                    <span className="next-event-location">
                      {[nextEvent.city, nextEvent.country].filter(Boolean).join(", ") || "Location TBA"}
                    </span>
                    <span className="next-event-date">
                      {nextEvent.startDate
                        ? new Date(nextEvent.startDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })
                        : "Date TBA"}
                    </span>
                    <span className="next-event-price">
                      {nextEvent.lowestPrice != null
                        ? `From ${nextEvent.lowestPrice} NOK`
                        : "Price TBA"}
                    </span>
                  </div>
                  {nextEvent.description && (
                    <p className="next-event-description">{nextEvent.description}</p>
                  )}
                </div>
              </Link>
            )}

            {!isLoading && !isError && !nextEvent && (
              <div className="next-event-message">
                No upcoming events available.
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="section-title">
            Upcoming
          </h2>

          <div className="upcoming-events-content">
            {isLoading && (
              <div className="upcoming-events-loader">
                {Array.from({ length: 4 }).map((_, index) => (
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
