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
  useGetAllCategories,
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

const EVENTS_PER_PAGE = 25;

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

  const { data: categoriesResponse } = useGetAllCategories();

  // Fetch all future events to determine active categories
  const { data: allEventsResponse } = useGetEvents({
    startDate: currentTime,
    size: 1000
  });

  // Calculate active category names (categories that have future events)
  const activeCategoryNames = useMemo(() => {
    if (categoriesResponse?.status !== 200 || allEventsResponse?.status !== 200) {
      return new Set<string>();
    }

    const events = allEventsResponse.data.content ?? [];
    const activeCategoryIds = new Set<number>();

    for (const event of events) {
      if (event.categoryIds) {
        for (const id of event.categoryIds) {
          activeCategoryIds.add(id);
        }
      }
    }

    const names = new Set<string>();
    for (const category of categoriesResponse.data) {
      if (category.id !== undefined && category.name && activeCategoryIds.has(category.id)) {
        names.add(category.name);
      }
    }

    return names;
  }, [categoriesResponse, allEventsResponse]);

  // Check which filtered categories are invalid (not in active categories)
  const invalidCategories = useMemo(() => {
    if (activeCategoryNames.size === 0 && filters.categories.length > 0) {
      // Still loading, don't mark as invalid yet
      return [];
    }
    return filters.categories.filter((cat) => !activeCategoryNames.has(cat));
  }, [filters.categories, activeCategoryNames]);

  const hasInvalidCategories = invalidCategories.length > 0;

  const favoritesQuery = useGetFavorites({
    query: {
      enabled: isLoggedIn
    }
  });

  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  // Only make the filtered request if all categories are valid
  const validCategories = filters.categories.filter((cat) => activeCategoryNames.has(cat));

  const { data: response, isLoading } = useGetEvents({
    query: query.trim() || undefined,
    city: filters.locations.length > 0 ? filters.locations : undefined,
    category: validCategories.length > 0 ? validCategories : undefined,
    startDate: toIsoDate(filters.startDate) || currentTime,
    endDate: toIsoDate(filters.endDate, true),
    minPrice: filters.priceMin,
    maxPrice: filters.priceMax,
    page: currentPage - 1,
    size: EVENTS_PER_PAGE,
    sort: sortOption?.value
  }, {
    query: {
      // Don't fetch if we have invalid categories and no valid ones
      enabled: !hasInvalidCategories || validCategories.length > 0
    }
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

  const clearCategoryFilter = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("category");
      newParams.delete("page");
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

  // Show message for invalid categories
  if (hasInvalidCategories && validCategories.length === 0) {
    return (
      <section className="events-grid events-grid-message">
        <p>No events with {invalidCategories.length === 1 ? "this category" : "these categories"} available.</p>
        <button
          type="button"
          className="pagination-button"
          onClick={clearCategoryFilter}
          style={{ marginTop: "1rem" }}
        >
          Clear filter
        </button>
      </section>
    );
  }

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

  const pageData = response.data as typeof response.data & {
    total?: number;
    totalElements?: number;
    pageable?: {
      pageSize?: number;
    };
  };

  const events = pageData.content ?? [];
  const pageSize = pageData.pageable?.pageSize ?? EVENTS_PER_PAGE;
  const totalEvents = pageData.total ?? pageData.totalElements ?? 0;
  const totalPages = Math.ceil(totalEvents / pageSize);

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
