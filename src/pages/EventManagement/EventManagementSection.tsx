import EventManagementEntry from "./EventManagementEntry";
import styles from "./EventManagement.module.css";

type EventManagementSectionProps = {
  title: string;
  buttonText: string;
  headers: string[];
  entries: (string | number)[][];
  onCreate: () => void;
  onEntryClick?: (index: number) => void;
};

export default function EventManagementSection({
  title,
  buttonText,
  headers,
  entries,
  onCreate,
  onEntryClick
}: EventManagementSectionProps) {
  return (
    <section className={styles.managementSection}>
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
        <button type="button" className={styles.createButton} onClick={onCreate}>
          {buttonText}
          <span>+</span>
        </button>
      </div>

      <div className={styles.managementBox}>
        <div
          className={styles.tableHeader}
          style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
        >
          {headers.map((header) => (
            <span key={header}>{header}</span>
          ))}
        </div>

        <div className={styles.entriesList}>
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <EventManagementEntry
                key={`${title}-${index}`}
                values={entry}
                columnCount={headers.length}
                onClick={() => onEntryClick?.(index)}
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>No entries found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
