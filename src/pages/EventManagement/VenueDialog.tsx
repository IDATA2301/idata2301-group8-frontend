import { forwardRef, useImperativeHandle, useRef } from "react";
import styles from "./DialogForm.module.css";
import VenueFields from "./VenueFields";

type VenueDialogProps = {
  onClose: () => void;
  onSuccess: () => void;
};

const VenueDialog = forwardRef<HTMLDialogElement, VenueDialogProps>(function VenueDialog({
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
        <h2>Create venue</h2>
        <VenueFields onClose={handleClose} onSuccess={onSuccess} />
      </div>
    </dialog>
  );
});

export default VenueDialog;
