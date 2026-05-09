import { Link } from "react-router-dom";
import type { EventResponse } from "@api/events";
import FavoriteIcon from "@assets/icons/favorite.svg";
import FavoriteClickedIcon from "@assets/icons/favoriteclicked.svg";
import "./EventCard.css";

interface Props extends EventResponse {
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function EventCard({
  isFavorite = false,
  onToggleFavorite,
  ...p
}: Props) {
  return (
    <Link to={p.slug || ""} className="event-card">
      <button
        className="favorite-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite?.();
        }}
      >
        <img
          src={isFavorite ? FavoriteClickedIcon : FavoriteIcon}
          alt="Favorite"
          className="favorite-icon"
        />
      </button>

      <img
        className="event-card-image"
        src={p.imageUrl || "/images/default.jpg"}
        alt={p.eventName}
      />

      <div className="event-card-box">
        <h3>{p.eventName}</h3>

        <div className="event-tags">
          {[...(p.categoryNames ?? []), p.city].map((category) => (
            <span key={category} className="tag">
              {category}
            </span>
          ))}
        </div>

        <p className="event-date">
          {p.startDate ? new Date(p.startDate).toLocaleString() : "No date yet"}
        </p>

        <p className="event-price">
          {p.lowestPrice != null ? `From ${p.lowestPrice} NOK` : "No price yet"}
        </p>
      </div>
    </Link>
  );
}
