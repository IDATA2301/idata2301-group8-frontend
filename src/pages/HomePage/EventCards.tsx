import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetFavoritesQueryKey,
  useAddFavorite,
  useGetFavorites,
  useRemoveFavorite
} from "@api/events";
import type { EventResponse } from "@api/events";
import toast from "@components/Toast";
import EventCard from "@pages/EventCard/EventCard";

type Props = {
  events: EventResponse[];
};

export default function EventCards({ events }: Props) {
  const queryClient = useQueryClient();
  const favoritesQuery = useGetFavorites();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const favoriteIds = useMemo(() => {
    const favorites = Array.isArray(favoritesQuery.data?.data)
      ? favoritesQuery.data.data
      : [];

    return new Set(
      favorites
        .map((favorite) => favorite.eventId)
        .filter((id): id is number => typeof id === "number")
    );
  }, [favoritesQuery.data]);

  async function handleToggleFavorite(nextIsFavorite: boolean, event: EventResponse) {
    if (!event.eventId) {
      toast.error("Missing event id");
      throw new Error("Missing event id");
    }

    try {
      if (nextIsFavorite) {
        await addFavoriteMutation.mutateAsync({
          data: {
            eventId: event.eventId
          }
        });

        toast.success("Added to favorites");
      } else {
        await removeFavoriteMutation.mutateAsync({
          eventId: event.eventId
        });

        toast.success("Removed from favorites");
      }

      await queryClient.invalidateQueries({
        queryKey: getGetFavoritesQueryKey()
      });
    } catch (error) {
      toast.error(
        nextIsFavorite
          ? "Failed to add favorite"
          : "Failed to remove favorite"
      );

      throw error;
    }
  }

  if (events.length === 0) {
    return <p>No upcoming events available.</p>;
  }

  return (
    <div className="upcoming-events-scroll">
      {events.map((event) => (
        <EventCard
          key={event.eventId ?? event.slug}
          {...event}
          isFavorite={event.eventId ? favoriteIds.has(event.eventId) : false}
          onToggleFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}
