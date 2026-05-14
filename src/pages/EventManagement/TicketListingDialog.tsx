import { useEffect, useRef } from "react";
import styles from "./DialogForm.module.css";
import TicketListingFields from "./TicketListingFields";
import type { EventResponse, TicketListingResponse } from "@api/events";

type PopupMode = "create" | "edit";
type SelectedCompanyId = "all" | number;

type CompanyOption = {
  companyId: number;
  companyName: string;
};

type TicketListingDialogProps = {
  isOpen: boolean;
  mode: PopupMode;
  events: EventResponse[];
  selectedCompanyId: SelectedCompanyId;
  companyOptions: CompanyOption[];
  selectedTicketListing?: TicketListingResponse;
  onClose: () => void;
  onSuccess: () => void;
};

export default function TicketListingDialog({
  isOpen,
  mode,
  events,
  selectedCompanyId,
  companyOptions,
  selectedTicketListing,
  onClose,
  onSuccess
}: TicketListingDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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
          {mode === "create" ? "Create ticket listing" : "Edit ticket listing"}
        </h2>

        <TicketListingFields
          mode={mode}
          events={events}
          selectedCompanyId={selectedCompanyId}
          companyOptions={companyOptions}
          selectedTicketListing={selectedTicketListing}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </dialog>
  );
}
