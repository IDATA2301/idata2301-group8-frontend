import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import EventCard from "src/pages/EventCard/EventCard";
import EventCardLoader from "@components/EventCardLoader/EventCardLoader";
import type { Filters as FiltersType } from "@pages/SearchPage/Filters";
import { sortOptions } from "@pages/SearchPage/SearchPage";
import { useAuthContext } from "@utility/AuthContext";
import {
  getGetFavoritesQueryKey,
  useAddFavorite,
  useGetEvents,
  useGetFavorites,
  useRemoveFavorite
} from "@api/events";
import type { EventResponse } from "@api/events";
import toast from "@components/Toast";

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
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const isLoggedIn = Boolean(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;
  const sortOption = sortOptions.find((o) => o.value === sort);
  const currentTime = useMemo(() => new Date().toISOString(), []);

  const favoritesQuery = useGetFavorites({
    query: {
      enabled: isLoggedIn
    }
  });

  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const { data: response, isLoading } = useGetEvents({
    query: query.trim() || undefined,
    city: filters.locations.length > 0 ? filters.locations : undefined,
    category: filters.categories.length > 0 ? filters.categories : undefined,
    startDate: toIsoDate(filters.startDate) || currentTime,
    endDate: toIsoDate(filters.endDate, true),
    minPrice: filters.priceMin,
    maxPrice: filters.priceMax,
    page: currentPage - 1,
    size: EVENTS_PER_PAGE,
    sort: sortOption?.value
  });

  const favorites = isLoggedIn && Array.isArray(favoritesQuery.data?.data)
    ? favoritesQuery.data.data
    : [];

  const favoriteEventIds = new Set(
    favorites
      .map((favorite) => favorite.eventId)
      .filter(Boolean)
  );

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

  const handleToggleFavorite = async (nextIsFavorite: boolean, event: EventResponse) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to favorite events");
      throw new Error("User must be logged in to favorite events");
    }

    if (!event.eventId) {
      toast.error("Missing event id");
      throw new Error("Missing event id");
    }

    try {
      if (nextIsFavorite) {
        await addFavoriteMutation.mutateAsync({ data: { eventId: event.eventId } });
        toast.success("Added to favorites");
      } else {
        await removeFavoriteMutation.mutateAsync({ eventId: event.eventId });
        toast.success("Removed from favorites");
      }

      await queryClient.invalidateQueries({
        queryKey: getGetFavoritesQueryKey()
      });
    } catch {
      toast.error("Failed to update favorite");
      throw new Error("Failed to update favorite");
    }
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
            isFavorite={favoriteEventIds.has(event.eventId)}
            onToggleFavorite={handleToggleFavorite}
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
                className={`pagination-button ${currentPage === page ? "pagination-button-active" : ""}`}
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
