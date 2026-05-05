import { Link } from "react-router-dom";
import "./EventCard.css";
import type { EventResponse } from "@api/events";

export default function EventCard(p: EventResponse) {
  return (
    <Link to={p.slug || ''} className="event-card">
      <img
        className="event-card-image"
        src={p.slug ? `/images/${p.slug}.jpg` : '/images/default.jpg'}
        alt="Aurora Concert"
      />
      <div className="event-card-box">
        <h3>{p.eventName}</h3>
        <div className="event-tags">
          {([...(p.categoryNames ?? []), p.city]).map(category => (
            <span key={category} className="tag">{category}</span>
          ))}
        </div>
        <p className="event-date">{"no date yet"}</p>
        <p className="event-price">From {"no price yet"} NOK</p>
      </div>
    </Link>
  );
}
