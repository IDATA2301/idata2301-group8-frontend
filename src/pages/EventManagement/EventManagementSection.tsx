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
  const gridTemplateColumns = `repeat(${headers.length}, minmax(0, 1fr))`;

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
        <div className={styles.tableHeader} style={{ gridTemplateColumns }}>
          {headers.map((header) => (
            <span key={header}>{header}</span>
          ))}
        </div>

        <div className={styles.entriesList}>
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <button
                key={`${title}-${index}`}
                type="button"
                className={styles.eventManagementEntry}
                style={{ gridTemplateColumns }}
                onClick={() => onEntryClick?.(index)}
              >
                {entry.map((value, valueIndex) => (
                  <span key={valueIndex} title={String(value)}>
                    {value}
                  </span>
                ))}
              </button>
            ))
          ) : (
            <p className={styles.emptyMessage}>No entries found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
