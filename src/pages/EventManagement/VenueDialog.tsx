import { forwardRef, useImperativeHandle, useRef } from "react";
import styles from "./DialogForm.module.css";
import VenueFields from "./VenueFields";
import type { VenueResponse } from "@api/events";

type VenueDialogProps = {
  mode: "create" | "edit";
  selectedVenue?: VenueResponse;
  onClose: () => void;
  onSuccess: () => void;
};

const VenueDialog = forwardRef<HTMLDialogElement, VenueDialogProps>(function VenueDialog({
  mode,
  selectedVenue,
  onClose,
  onSuccess
}, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

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
        <h2>{mode === "create" ? "Create venue" : "Edit venue"}</h2>

        <VenueFields
          key={`${mode}-${selectedVenue?.id ?? "create"}`}
          mode={mode}
          selectedVenue={selectedVenue}
          onClose={handleClose}
          onSuccess={onSuccess}
        />
      </div>
    </dialog>
  );
});

export default VenueDialog;
