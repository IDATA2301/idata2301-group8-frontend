import "./style.css"
import ChooseTickets from "./ChooseTickets";
import { type Ticket } from "./TicketCard.tsx";
import ScrollToTop from "@utility/ScrollToTop.tsx";
import { Link } from "react-router-dom";
import openInNew from "@assets/icons/open-in-new.svg"

type Props = {
  imgSrc: string,
  title: string,
  description: string,
  tags: string[],
  tickets: Ticket[],
  location: Location
}

type Location = {
  name: string,
  address: string,
  postalCode: string,
  city: string
  iframeSrc: string
  openInMapsUrl: string
}

function EventPage(p: Props) {
  return (
    <>

      <ScrollToTop />
      <div className="hero-image-event" style={{ backgroundImage: `url(${p.imgSrc})` }}>
      </div>
      <div className="event-page-banner">
        <h1 className="event-page-title">{p.title}</h1>
        <p className="event-page-decription">{p.description}</p>
        <div className="event-tags">
          {p.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="center-box">
        <ChooseTickets tickets={[
          { id: 1, name: "Adult entry", price: 250.00 },
          { id: 2, name: "Child entry", price: 150.00 }
        ]} />
        <hr className="page-divider-line" />
        <div className="event-page-location-box">
          <div className="event-page-location-info-box">
            <div>
              <h3 className="event-page-location-title">Address</h3>
              <p className="event-page-location-address">{p.location.name}</p>
              <p className="event-page-location-address">{p.location.address}</p>
              <p className="event-page-location-address">{p.location.postalCode} {p.location.city}</p>
            </div>
            <Link to={p.location.openInMapsUrl} target="_blank" className="event-page-location-action-button">Open in Google Maps <img src={openInNew} alt="decrement icon" />
            </Link>
          </div>
          <iframe className="event-page-location-iframe" src={p.location.iframeSrc} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

        </div>
      </div>
    </>
  )
}

export default EventPage;
