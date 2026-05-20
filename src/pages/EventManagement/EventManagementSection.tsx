import styles from "./EventManagement.module.css";

export type SortOption = "default" | "soonest" | "latest";

type EventManagementSectionProps = {
  title: string;
  buttonText: string;
  headers: string[];
  entries: (string | number | React.ReactNode)[][];
  onCreate: () => void;
  onEntryClick?: (index: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  sortValue?: SortOption;
  onSortChange?: (value: SortOption) => void;
  showSort?: boolean;
};

export default function EventManagementSection({
  title,
  buttonText,
  headers,
  entries,
  onCreate,
  onEntryClick,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  sortValue,
  onSortChange,
  showSort = false
}: EventManagementSectionProps) {
  const gridTemplateColumns = `repeat(${headers.length}, minmax(0, 1fr))`;

  return (
    <section className={styles.managementSection}>
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
        <div className={styles.sectionActions}>
          {showSort && onSortChange && (
            <select
              className={styles.sortSelect}
              value={sortValue ?? "default"}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
            >
              <option value="default">Default</option>
              <option value="soonest">Happening soonest</option>
              <option value="latest">Happening latest</option>
            </select>
          )}
          {onSearchChange && (
            <input
              type="text"
              className={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          )}
          <button type="button" className={styles.createButton} onClick={onCreate}>
            {buttonText}
            <span>+</span>
          </button>
        </div>
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
