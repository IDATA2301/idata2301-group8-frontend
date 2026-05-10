import { useQueries, useQueryClient } from "@tanstack/react-query";
import {
  getGetEventByIdQueryOptions,
  getGetFavoritesQueryKey,
  useGetFavorites,
  useRemoveFavorite
} from "@api/events";
import type { EventResponse } from "@api/events";
import toast from "@components/Toast";
import EventCard from "@pages/EventCard/EventCard";
import styles from "./Favorites.module.css";

export default function Favorites() {
  const queryClient = useQueryClient();
  const favoritesQuery = useGetFavorites();
  const removeFavoriteMutation = useRemoveFavorite();

  const favorites = Array.isArray(favoritesQuery.data?.data)
    ? favoritesQuery.data.data
    : [];

  const favoriteIds = favorites
    .map((favorite) => favorite.eventId)
    .filter(Boolean);

  const eventQueries = useQueries({
    queries: favoriteIds.map((id) => getGetEventByIdQueryOptions(id!))
  });

  const isLoading =
    favoritesQuery.isLoading ||
    eventQueries.some((query) => query.isLoading);

  const isError =
    favoritesQuery.isError ||
    eventQueries.some((query) => query.isError);

  const favoriteEvents: EventResponse[] = eventQueries
    .map((query) => query.data?.data)
    .filter(
      (event): event is EventResponse =>
        typeof event === "object" &&
        event !== null &&
        "eventId" in event
    );

  async function handleRemoveFavorite(eventId: number) {
    try {
      await removeFavoriteMutation.mutateAsync({ eventId });
      await queryClient.invalidateQueries({
        queryKey: getGetFavoritesQueryKey()
      });

      toast.success("Removed from favorites");
    } catch {
      toast.error("Failed to remove favorite");
    }
  }

  return (
    <div className={styles.eventsContainer}>
      <div className={styles.eventsSection}>
        <h2>Favorites</h2>

        <div className={styles.eventsScrollBox}>
          {isLoading && (
            <div className={styles.placeholderBox}>
              Loading favorites...
            </div>
          )}

          {isError && (
            <div className={styles.placeholderBox}>
              Failed to load favorites
            </div>
          )}

          {!isLoading && !isError && favoriteEvents.length === 0 && (
            <div className={styles.placeholderBox}>
              No favorite events found
            </div>
          )}

          {favoriteEvents.map((event) => (
            <EventCard
              key={event.eventId}
              {...event}
              isFavorite
              onToggleFavorite={() => handleRemoveFavorite(event.eventId!)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
