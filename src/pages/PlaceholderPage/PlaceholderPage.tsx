import styles from "./PlaceholderPage.module.css";

export default function PlaceholderPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.label}>Placeholder page</span>
        <h1>Coming soon</h1>
        <p>
          This page is part of the website prototype, but the full content has not been implemented yet.
        </p>
        <a href="/" className={styles.link}>
          Back to home
        </a>
      </section>
    </main>
  );
}
