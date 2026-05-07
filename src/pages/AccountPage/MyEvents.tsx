import styles from "./AccountPage.module.css";

export default function MyEvents() {

  return (
    <div className={styles.eventsContainer}>

      <div className={styles.eventsSection}>

        <h2>Ongoing Events</h2>

        <div className={styles.eventsScrollBox}>

          <div className={styles.placeholderBox}>
            Your active tickets will appear here
          </div>

        </div>

      </div>

      <div className={styles.eventsSection}>

        <h2>Expired Events</h2>

        <div className={styles.eventsScrollBox}>

          <div className={styles.placeholderBox}>
            Your expired tickets will appear here
          </div>

        </div>

      </div>

    </div>
  );
}
