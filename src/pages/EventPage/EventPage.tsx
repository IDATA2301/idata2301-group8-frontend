import { useParams } from "react-router-dom";
import { useGetAllVenues, useGetEventBySlug } from "@api/events";
import ScrollToTop from "@utility/ScrollToTop.tsx";
import fallbackEventImage from "@assets/fallback-image.png";
import EventTicketListings from "./EventTicketListings";
import StateBanner from "@components/StateBanner/StateBanner";
import "./style.css";

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

  const {
    data: venuesResponse,
    isLoading: venuesLoading
  } = useGetAllVenues();

  const event =
    eventResponse?.status !== 200
      ? undefined
      : eventResponse.data;

  const venues =
    venuesResponse?.status !== 200 || !Array.isArray(venuesResponse.data)
      ? []
      : venuesResponse.data;

  const venue = venues.find((item) => item.id === event?.venueId);
  const locationTags = [venue?.city, venue?.country].filter(Boolean);
  const locationText = locationTags.join(", ") || "Unknown location";

  if (eventLoading || venuesLoading) {
    return <StateBanner description="Loading event..." showBackLink={false} />;
  }

  if (eventError || !event) {
    return (
      <StateBanner
        title="Event not found"
        description="This event does not exist, or it may no longer be available."
      />
    );
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
        {locationTags.length > 0 && (
          <div className="event-tags">
            {locationTags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="center-box">
        <EventTicketListings
          eventId={event.eventId}
          eventName={event.eventName ?? "Untitled event"}
        />
        <hr className="page-divider-line" />
        <div className="event-page-location-box">
          <div className="event-page-location-info-box">
            <div>
              <h3 className="event-page-location-title">Location</h3>
              <p className="event-page-location-address">
                {venue?.name ?? "Unknown venue"}
              </p>
              <p className="event-page-location-address">
                {locationText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventPage;
