import { Link, useParams } from "react-router-dom";
import { useGetEventBySlug } from "@api/events";
import ScrollToTop from "@utility/ScrollToTop.tsx";
import openInNew from "@assets/icons/open-in-new.svg";
import fallbackEventImage from "@assets/fallback-image.png";
import EventTicketListings from "./EventTicketListings";
import "./style.css";
import StateBanner from "@components/StateBanner/StateBanner";

function EventPage() {
  const { slug } = useParams();

  const {
    data: eventResponse,
    isLoading: eventLoading,
    isError: eventError
  } = useGetEventBySlug(slug ?? "", {
    query: {
      enabled: !!slug
    }
  });

  const event =
    eventResponse?.status !== 200
      ? undefined
      : eventResponse.data;

  const tags = [
    ...(event?.categoryNames ?? []),
    ...(event?.extraFeatureNames ?? [])
  ];

  const locationQuery = [event?.venueName, event?.city]
    .filter(Boolean)
    .join(" ");

  const mapsUrl =
    locationQuery.length > 0
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`
      : "https://www.google.com/maps";

  const iframeUrl =
    locationQuery.length > 0
      ? `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&output=embed`
      : "";

  if (eventLoading) {
    return <StateBanner description="Loading event..." showBackLink={false} />;
  }

  if (eventError || !event) {
    return <StateBanner
      title="Event not found"
      description="This event does not exist, or it may no longer be available."
    />;
  }

  return (
    <>
      <ScrollToTop />

      <div
        className="hero-image-event"
        style={{
          backgroundImage: `url(${event.imageUrl || fallbackEventImage})`
        }}
      />

      <div className="event-page-banner">
        <h1 className="event-page-title">
          {event.eventName ?? "Untitled event"}
        </h1>

        <p className="event-page-decription">
          {event.description ?? "No description available."}
        </p>

        {tags.length > 0 && (
          <div className="event-tags">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="center-box">
        <EventTicketListings eventId={event.eventId} />

        <hr className="page-divider-line" />

        <div className="event-page-location-box">
          <div className="event-page-location-info-box">
            <div>
              <h3 className="event-page-location-title">Address</h3>

              <p className="event-page-location-address">
                {event.venueName ?? "Unknown venue"}
              </p>

              <p className="event-page-location-address">
                {event.city ?? "Unknown city"}
              </p>
            </div>

            <Link
              to={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="event-page-location-action-button"
            >
              Open in Google Maps

              <img src={openInNew} alt="open in new tab" />
            </Link>
          </div>

          {iframeUrl && (
            <iframe
              className="event-page-location-iframe"
              src={iframeUrl}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </div>
    </>
  );
}

export default EventPage;
