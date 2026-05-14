import { useEffect, useRef } from "react";
import styles from "./DialogForm.module.css";
import EventFields from "./EventFields";
import { useGetAllCategories, useGetAllVenues, type EventResponse } from "@api/events";

type PopupMode = "create" | "edit";

type EventDialogProps = {
  isOpen: boolean;
  mode: PopupMode;
  selectedEvent?: EventResponse;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EventDialog({
  isOpen,
  mode,
  selectedEvent,
  onClose,
  onSuccess
}: EventDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { data: venuesResponse } = useGetAllVenues();
  const { data: categoriesResponse } = useGetAllCategories();

  const venues =
    venuesResponse?.status === 200
      ? venuesResponse.data
      : [];

  const categories =
    categoriesResponse?.status === 200
      ? categoriesResponse.data
      : [];

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onCancel={onClose}
    >
      <div className={styles.dialogContent}>
        <h2>
          {mode === "create" ? "Create event" : "Edit event"}
        </h2>

        <EventFields
          mode={mode}
          venues={venues}
          categories={categories}
          selectedEvent={selectedEvent}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </dialog>
  );
}
