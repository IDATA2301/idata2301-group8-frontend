import xIcon from "@assets/icons/x.svg";
import styles from "./CreationEditPopup.module.css";
import EventFields from "./EventFields";
import TicketListingFields from "./TicketListingFields";
import type { CategoryResponse, EventResponse, TicketListingResponse, VenueResponse } from "@api/events";

type PopupType = "event" | "ticketListing";
type PopupMode = "create" | "edit";
type SelectedCompanyId = "all" | number;

type CreationEditPopupProps = {
  type: PopupType;
  mode: PopupMode;
  events: EventResponse[];
  venues: VenueResponse[];
  categories: CategoryResponse[];
  selectedCompanyId: SelectedCompanyId;
  selectedEvent?: EventResponse;
  selectedTicketListing?: TicketListingResponse;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreationEditPopup({
  type,
  mode,
  events,
  venues,
  categories,
  selectedCompanyId,
  selectedEvent,
  selectedTicketListing,
  onClose,
  onSuccess
}: CreationEditPopupProps) {
  const isEventPopup = type === "event";
  const titlePrefix = mode === "create" ? "Create" : "Edit";
  const titleName = isEventPopup ? "event" : "ticket listing";

  return (
    <div className={styles.dialogBackdrop}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h2>{`${titlePrefix} ${titleName}`}</h2>
          <button type="button" onClick={onClose} className={styles.closeButton}>
            <img src={xIcon} alt="" />
          </button>
        </div>

        {isEventPopup ? (
          <EventFields
            mode={mode}
            venues={venues}
            categories={categories}
            selectedEvent={selectedEvent}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        ) : (
          <TicketListingFields
            mode={mode}
            events={events}
            selectedCompanyId={selectedCompanyId}
            selectedTicketListing={selectedTicketListing}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </div>
  );
}
