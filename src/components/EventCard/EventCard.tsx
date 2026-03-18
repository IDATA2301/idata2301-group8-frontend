import { Link } from "react-router-dom";
import "./EventCard.css";

type Props = {
  href: string,
  imgSrc: string,
  title: string,
  tags: string[],
  date: string,
  price: number
}

export default function EventCard(p: Props) {
  return (
    <Link to={p.href} className="event-card">
      <img
        className="event-card-image"
        src={p.imgSrc}
        alt="Aurora Concert"
      />
      <div className="event-card-box">
        <h3>{p.title}</h3>
        <div className="event-tags">
          {p.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <p className="event-date">{p.date}</p>
        <p className="event-price">From {p.price} NOK</p>
      </div>
    </Link>
  );
}
