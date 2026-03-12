import "./EventCard.css";
import auroraconcert from "@assets/auroraconcert.jpg";

export default function EventCard() {
  return (
    <div className="event-card">

      <img
        className="event-card-image"
        src={auroraconcert}
        alt="Aurora Concert"
      />

      <div className="event-card-box">

        <h3>Aurora Live in Concert</h3>

        <div className="event-tags">
          <span className="tag">Concert</span>
          <span className="tag">Bergen, Norway</span>
        </div>

        <p className="event-date">
          Wed, 4 Mar 2026, 17:00
        </p>

        <p className="event-price">
          From 890 NOK
        </p>

      </div>

    </div>
  );
}
