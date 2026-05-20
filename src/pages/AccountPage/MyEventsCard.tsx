import styles from "./MyEventsCard.module.css";
import FavoriteIcon from "@assets/icons/favorite.svg";
import ShareIcon from "@assets/icons/share.svg";
import DownloadIcon from "@assets/icons/download.svg";

interface Props {
  eventName: string;
  eventDate: string;
  startTime?: string;
  ticketCount: number;
  onClick?: () => void;
}

export default function MyEventCard({
  eventName,
  eventDate,
  startTime,
  ticketCount,
  onClick
}: Props) {
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  return (
    <div className={`${styles.eventRow} ${onClick ? styles.clickable : ""}`} onClick={onClick}>
      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>
          {eventName}
        </h3>
        <p className={styles.eventMeta}>
          {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"}
          {" • "}
          {formatDate(eventDate)}
          {startTime && (
            <>
              {" • "}
              {startTime}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
