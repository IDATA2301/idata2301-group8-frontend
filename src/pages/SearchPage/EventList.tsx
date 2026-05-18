import { useSearchParams } from "react-router-dom";
import EventCard from "src/pages/EventCard/EventCard";
import EventCardLoader from "@components/EventCardLoader/EventCardLoader";
import type { Filters as FiltersType } from "@pages/SearchPage/Filters";
import { sortOptions } from "@pages/SearchPage/SearchPage";
import { useGetEvents } from "@api/events";

type Params = {
  query: string;
  filters: FiltersType;
  sort: string;
};

const EVENTS_PER_PAGE = 15;

const toIsoDate = (date: string, endOfDay = false) => {
  if (!date) {
    return undefined;
  }

  return endOfDay
    ? new Date(`${date}T23:59:59`).toISOString()
    : new Date(`${date}T00:00:00`).toISOString();
};

const EventList = ({ query, filters, sort }: Params) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;

  const sortOption = sortOptions.find((o) => o.value === sort);

  const { data: response, isLoading } = useGetEvents({
    filter: {
      query: query.trim() || undefined,
      city: filters.locations[0] || undefined,
      category: filters.categories[0] || undefined,
      startDate: toIsoDate(filters.startDate),
      endDate: toIsoDate(filters.endDate, true),
      minPrice: filters.priceMin > 0 ? filters.priceMin : undefined,
      maxPrice: filters.priceMax > 0 && filters.priceMax !== 9999
        ? filters.priceMax
        : undefined,
    },
    page: currentPage - 1,
    size: EVENTS_PER_PAGE,
    // sortBy: sortOption?.sortBy,
    // sortDirection: sortOption?.sortDirection
  });

  const goToPage = (page: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (page > 1) {
        newParams.set("page", String(page));
      } else {
        newParams.delete("page");
      }

      return newParams;
    });
  };

  if (isLoading) {
    return (
      <section className="events-grid">
        {Array.from({ length: EVENTS_PER_PAGE }).map((_, index) => (
          <EventCardLoader key={index} />
        ))}
      </section>
    );
  }

  if (!response) {
    return (
      <section className="events-grid events-grid-message">
        <p>Backend not connected.</p>
      </section>
    );
  }

  if (response.status !== 200) {
    return (
      <section className="events-grid events-grid-message">
        <p>Something went wrong.</p>
      </section>
    );
  }

  const pageData = response.data;
  const events = pageData.content ?? [];
  const totalPages = pageData.totalPages ?? 0;

  if (events.length === 0) {
    return (
      <section className="events-grid events-grid-message">
        <p>No events found.</p>
      </section>
    );
  }

  return (
    <>
      <section className="events-grid">
        {events.map((event) => (
          <EventCard
            key={event.eventId}
            {...event}
          />
        ))}
      </section>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                className={`pagination-button ${currentPage === page ? "pagination-button-active" : ""
                  }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default EventList;
