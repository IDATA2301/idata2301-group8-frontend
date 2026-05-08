import styles from "./MyEventsCard.module.css";

import FavoriteIcon from "@assets/icons/favorite.svg";
import ShareIcon from "@assets/icons/share.svg";
import DownloadIcon from "@assets/icons/download.svg";

interface Props {

  eventName: string;

  eventDate: string;

  startTime?: string;

  ticketCount?: number;

}

export default function MyEventCard({
  eventName,
  eventDate,
  startTime,
  ticketCount = 2
}: Props) {

  function formatDate(date: string) {

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

  }

  return (

    <div className={styles.eventRow}>

      <div className={styles.eventContent}>

        <h3 className={styles.eventTitle}>

          {eventName}

        </h3>

        <p className={styles.eventMeta}>

          {ticketCount} tickets
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

      <div className={styles.eventActions}>

        <button className={styles.iconButton}>

          <img
            src={FavoriteIcon}
            alt="Favorite"
          />

        </button>

        <button className={styles.iconButton}>

          <img
            src={ShareIcon}
            alt="Share"
          />

        </button>

        <button className={styles.iconButton}>

          <img
            src={DownloadIcon}
            alt="Download"
          />

        </button>

      </div>

    </div>

  );

}
