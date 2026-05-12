import styles from "./EventManagement.module.css";

type EventManagementEntryProps = {
  values: (string | number)[];
  columnCount: number;
  onClick?: () => void;
};

export default function EventManagementEntry({
  values,
  columnCount,
  onClick
}: EventManagementEntryProps) {
  return (
    <button
      type="button"
      className={styles.eventManagementEntry}
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      onClick={onClick}
    >
      {values.map((value, index) => (
        <span key={index} title={String(value)}>
          {value}
        </span>
      ))}
    </button>
  );
}
