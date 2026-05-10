import "./FeaturedEventCard.css";

import { Link } from "react-router-dom";

import location from "@assets/icons/location.svg";
import fallbackEventImage from "@assets/fallback-image.png";

import type { EventResponse } from "@api/events";

type Props = {
  event: EventResponse;
};

export default function FeaturedEventCard({ event }: Props) {
  const category =
    event.categoryNames?.[0] ?? "Event";

  const dateText =
    event.startDate
      ? new Date(event.startDate).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : "Date TBA";

  const priceText =
    event.lowestPrice != null
      ? `From ${event.lowestPrice} NOK`
      : "Price TBA";

  const locationText =
    event.city ?? "Location TBA";

  return (
    <Link
      to={`/events/${event.slug}`}
      className="featured-event-container"
    >
      <img
        className="featured-event-image"
        src={event.imageUrl || fallbackEventImage}
        alt={event.eventName ?? "Featured event"}
      />

      <div className="featured-event-card">
        <h2 className="featured-event-title">
          {event.eventName ?? "Untitled event"}
        </h2>

        <p className="featured-event-description">
          {event.description ?? "No description available."}
        </p>

        <span className="featured-event-tag">
          {category}
        </span>

        <div className="featured-event-info">
          <div className="featured-info-row">
            <span>
              <img
                className="location-svg"
                src={location}
                alt="location icon"
              />

              {locationText}
            </span>
          </div>

          <div className="featured-info-row">
            <span>{dateText}</span>
          </div>

          <div className="featured-info-row">
            <span>{priceText}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
