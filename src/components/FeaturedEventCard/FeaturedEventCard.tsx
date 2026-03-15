import "./FeaturedEventCard.css"
import footballfeatured from "@assets/footballfeatured.jpeg"

export default function FeaturedEventCard() {
  return (
    <div className="featured-event-container">

      <img
        className="featured-event-image"
        src={footballfeatured}
        alt="Football Match"
      />

      <div className="featured-event-card">
        <h2 className="featured-event-title">
          Rosenborg vs. Molde – Eliteserien Match
        </h2>

        <p className="featured-event-description">
          En skikkelig spennende kamp!
        </p>

        <span className="featured-event-tag">Sport</span>

        <div className="featured-event-info">
          <div className="featured-info-row">
            <span>Trondheim, Norway</span>
          </div>

          <div className="featured-info-row">
            <span>Wed, 4. Mar 2026, 17:00</span>
          </div>

          <div className="featured-info-row">
            <span>42 NOK</span>
          </div>
        </div>
      </div>

    </div>
  );
}
