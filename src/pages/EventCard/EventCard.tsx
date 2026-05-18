import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { EventResponse } from "@api/events";
import { usePrefetchEvent } from "@utility/usePrefetchEvent";
import FavoriteIcon from "@assets/icons/favorite.svg";
import FavoriteClickedIcon from "@assets/icons/favoriteclicked.svg";
import fallbackEventImage from "@assets/fallback-image.png";
import "./EventCard.css";

interface Props extends EventResponse {
  isFavorite?: boolean;
  onToggleFavorite?: (nextIsFavorite: boolean, event: EventResponse) => void | Promise<void>;
}

export default function EventCard({ isFavorite = false, onToggleFavorite, ...p }: Props) {
  const { prefetch } = usePrefetchEvent();
  const [visibleFavorite, setVisibleFavorite] = useState(isFavorite);
  const imageUrl = p.imageUrl || fallbackEventImage;
  const imageAlt = p.eventName ?? "Event image";
  const date = p.startDate ? new Date(p.startDate).toLocaleString() : "No date yet";
  const price = p.lowestPrice != null ? `From ${p.lowestPrice} NOK` : "No price yet";
  const locationTags = [p.city, p.country].filter(Boolean);
  const eventPath = p.slug ? `/events/${p.slug}` : "#";

  useEffect(() => {
    setVisibleFavorite(isFavorite);
  }, [isFavorite]);

  async function handleToggleFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const nextIsFavorite = !visibleFavorite;
    setVisibleFavorite(nextIsFavorite);

    try {
      await onToggleFavorite?.(nextIsFavorite, p);
    } catch {
      setVisibleFavorite(!nextIsFavorite);
    }
  }

  return (
    <Link
      to={eventPath}
      className="event-card"
      onMouseEnter={() => p.slug && prefetch(p.slug)}
    >
      <button
        type="button"
        className={`favorite-button ${visibleFavorite ? "favorite-button-active" : ""}`}
        onClick={handleToggleFavorite}
        aria-label={visibleFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <img
          src={visibleFavorite ? FavoriteClickedIcon : FavoriteIcon}
          alt=""
          aria-hidden="true"
          className="favorite-icon"
        />
      </button>

      <img className="event-card-image" src={imageUrl} alt={imageAlt} />

      <div className="event-card-box">
        <h3>{p.eventName}</h3>

        <div className="event-tags">
          {locationTags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <p className="event-date">{date}</p>
        <p className="event-price">{price}</p>
      </div>
    </Link>
  );
}
