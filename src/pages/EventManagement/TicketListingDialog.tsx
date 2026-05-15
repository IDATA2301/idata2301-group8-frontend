import { forwardRef, useImperativeHandle, useRef } from "react";
import styles from "./DialogForm.module.css";
import TicketListingFields from "./TicketListingFields";
import type { CompanyDto } from "@api/iam";
import type { EventResponse, TicketListingResponse } from "@api/events";

type PopupMode = "create" | "edit";
type SelectedCompanyId = "all" | number;

type TicketListingDialogProps = {
  mode: PopupMode;
  events: EventResponse[];
  selectedCompanyId: SelectedCompanyId;
  companyOptions: CompanyDto[];
  selectedTicketListing?: TicketListingResponse;
  onClose: () => void;
  onSuccess: () => void;
};

const TicketListingDialog = forwardRef<HTMLDialogElement, TicketListingDialogProps>(
  function TicketListingDialog({
    mode,
    events,
    selectedCompanyId,
    companyOptions,
    selectedTicketListing,
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
          <h2>
            {mode === "create" ? "Create ticket listing" : "Edit ticket listing"}
          </h2>

          <TicketListingFields
            key={`${mode}-${selectedTicketListing?.ticketListingId ?? "create"}`}
            mode={mode}
            events={events}
            selectedCompanyId={selectedCompanyId}
            companyOptions={companyOptions}
            selectedTicketListing={selectedTicketListing}
            onClose={handleClose}
            onSuccess={onSuccess}
          />
        </div>
      </dialog>
    );
  }
);

export default TicketListingDialog;
