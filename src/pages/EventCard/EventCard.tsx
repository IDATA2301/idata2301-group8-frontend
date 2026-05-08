import { Link } from "react-router-dom";
import "./EventCard.css";

import type { EventResponse }
  from "@api/events";

import FavoriteIcon
  from "@assets/icons/favorite.svg";

import FavoriteClickedIcon
  from "@assets/icons/favoriteclicked.svg";

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
    <Link
      to={p.slug || ""}
      className="event-card"
    >

      <button
        className="favorite-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite?.();
        }}
      >

        <img
          src={
            isFavorite
              ? FavoriteClickedIcon
              : FavoriteIcon
          }
          alt="Favorite"
          className="favorite-icon"
        />

      </button>

      <img
        className="event-card-image"
        src={
          p.slug
            ? `/images/${p.slug}.jpg`
            : "/images/default.jpg"
        }
        alt={p.eventName}
      />

      <div className="event-card-box">

        <h3>{p.eventName}</h3>

        <div className="event-tags">

          {[
            ...(p.categoryNames ?? []),
            p.city,
          ].map((category) => (

            <span
              key={category}
              className="tag"
            >

              {category}

            </span>

          ))}

        </div>

        <p className="event-date">
          no date yet
        </p>

        <p className="event-price">
          From no price yet NOK
        </p>

      </div>

    </Link>
  );
}
