import styles from "./EventCardLoader.module.css";

export default function EventCardLoader() {
  return (
    <div className={styles.eventCardLoader} aria-label="Loading event">
      <div className={styles.shimmer} />
      <div className={styles.imagePlaceholder} />
      <div className={styles.content}>
        <div className={`${styles.line} ${styles.title}`} />
        <div className={styles.tags}>
          <div className={styles.tag} />
          <div className={styles.tag} />
        </div>
        <div className={`${styles.line} ${styles.date}`} />
        <div className={`${styles.line} ${styles.price}`} />
      </div>
    </div>
  );
}
