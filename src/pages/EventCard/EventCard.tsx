import { Link } from "react-router-dom";
import type { EventResponse } from "@api/events";
import { usePrefetchEvent } from "@utility/usePrefetchEvent";
import FavoriteIcon from "@assets/icons/favorite.svg";
import FavoriteClickedIcon from "@assets/icons/favoriteclicked.svg";
import fallbackEventImage from "@assets/fallback-image.png";
import "./EventCard.css";

interface Props extends EventResponse {
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function EventCard({ isFavorite = false, onToggleFavorite, ...p }: Props) {
  const { prefetch } = usePrefetchEvent();
  const imageUrl = p.imageUrl || fallbackEventImage;
  const imageAlt = p.eventName ?? "Event image";
  const date = p.startDate ? new Date(p.startDate).toLocaleString() : "No date yet";
  const price = p.lowestPrice != null ? `From ${p.lowestPrice} NOK` : "No price yet";
  const locationTags = [p.city, p.country].filter(Boolean);

  return (
    <Link
      to={"/events/" + p.slug || ""}
      className="event-card"
      onMouseEnter={() => p.slug && prefetch(p.slug)}
    >
      <button
        type="button"
        className={`favorite-button ${isFavorite ? "favorite-button-active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite?.();
        }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <img
          src={isFavorite ? FavoriteClickedIcon : FavoriteIcon}
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
