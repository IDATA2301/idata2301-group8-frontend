import styles from "./AccountPage.module.css";

export default function MyEvents() {

  return (
    <div className={styles.contentCard}>

      <h2>My Events</h2>

      <div className={styles.placeholderBox}>
        Your created events will appear here
      </div>

    </div>
  );
}
