import { forwardRef, useImperativeHandle, useRef } from "react";
import styles from "./DialogForm.module.css";
import EventFields from "./EventFields";
import {
  useGetAll,
  useGetAllCategories,
  useGetAllVenues,
  type EventResponse
} from "@api/events";

type PopupMode = "create" | "edit";

type EventDialogProps = {
  mode: PopupMode;
  selectedEvent?: EventResponse;
  onClose: () => void;
  onSuccess: () => void;
};

const EventDialog = forwardRef<HTMLDialogElement, EventDialogProps>(function EventDialog({
  mode,
  selectedEvent,
  onClose,
  onSuccess
}, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const venuesQuery = useGetAllVenues();
  const categoriesQuery = useGetAllCategories();
  const extraFeaturesQuery = useGetAll();

  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

  const venues = venuesQuery.data?.status === 200 ? venuesQuery.data.data : [];
  const categories = categoriesQuery.data?.status === 200 ? categoriesQuery.data.data : [];
  const extraFeatures = extraFeaturesQuery.data?.status === 200 ? extraFeaturesQuery.data.data : [];

  function handleClose() {
    dialogRef.current?.close();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      {...{ closedby: "any" }}
      onCancel={handleClose}
      onClose={onClose}
    >
      <div className={styles.dialogContent}>
        <h2>{mode === "create" ? "Create event" : "Edit event"}</h2>
        <EventFields
          key={`${mode}-${selectedEvent?.eventId ?? "create"}`}
          mode={mode}
          venues={venues}
          categories={categories}
          extraFeatures={extraFeatures}
          selectedEvent={selectedEvent}
          onClose={handleClose}
          onSuccess={onSuccess}
        />
      </div>
    </dialog>
  );
});

export default EventDialog;
