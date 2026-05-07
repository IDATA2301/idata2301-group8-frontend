import styles from "./AccountPage.module.css";

export default function Favorites() {

  return (
    <div className={styles.eventsContainer}>

      <div className={styles.eventsSection}>

        <h2>Favorites</h2>

        <div className={styles.eventsScrollBox}>

          <div className={styles.placeholderBox}>
            Favorite events will appear here
          </div>

        </div>

      </div>

    </div>
  );
}
