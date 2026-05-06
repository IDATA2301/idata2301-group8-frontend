import styles from "./AccountPage.module.css";

export default function Favorites() {

  return (
    <div className={styles.contentCard}>

      <h2>Favorites</h2>

      <div className={styles.placeholderBox}>
        Favorite events will appear here
      </div>

    </div>
  );
}
