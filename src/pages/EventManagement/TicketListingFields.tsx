import { useState } from "react";
import styles from "./CreationEditPopup.module.css";
import type { CreateTicketListingRequest, EventResponse, TicketListingResponse } from "@api/events";
import { useCreateTicketListing, useDeleteTicketListing } from "@api/events";

type SelectedCompanyId = "all" | number;

type TicketListingFieldsProps = {
  mode: "create" | "edit";
  events: EventResponse[];
  selectedCompanyId: SelectedCompanyId;
  selectedTicketListing?: TicketListingResponse;
  onClose: () => void;
  onSuccess: () => void;
};

export default function TicketListingFields({
  mode,
  events,
  selectedCompanyId,
  selectedTicketListing,
  onClose,
  onSuccess
}: TicketListingFieldsProps) {
  const companyId = selectedCompanyId === "all" ? undefined : selectedCompanyId;
  const request = companyId ? { headers: { "X-Company-Id": String(companyId) } } : undefined;
  const createTicketListing = useCreateTicketListing({ request });
  const deleteTicketListing = useDeleteTicketListing({ request });

  const [form, setForm] = useState({
    eventId: selectedTicketListing?.eventId?.toString() ?? "",
    ticketType: selectedTicketListing?.ticketType ?? "",
    startDate: selectedTicketListing?.startDate?.slice(0, 10) ?? "",
    endDate: selectedTicketListing?.endDate?.slice(0, 10) ?? "",
    price: selectedTicketListing?.price?.toString() ?? "",
    currency: selectedTicketListing?.currency ?? "NOK",
    ticketsAvailable: selectedTicketListing?.ticketsAvailable?.toString() ?? ""
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function buildRequest(): CreateTicketListingRequest {
    return {
      eventId: Number(form.eventId),
      ticketType: form.ticketType,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      price: Number(form.price),
      currency: form.currency,
      ticketsAvailable: Number(form.ticketsAvailable)
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!companyId || mode === "edit") return;
    createTicketListing.mutate({ data: buildRequest() }, { onSuccess: handleSuccess });
  }

  function handleDelete() {
    if (!companyId || !selectedTicketListing?.ticketListingId) return;
    deleteTicketListing.mutate({ id: selectedTicketListing.ticketListingId }, {
      onSuccess: handleSuccess
    });
  }

  function handleSuccess() {
    onSuccess();
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.dialogGrid}>
        <section className={styles.formSection}>
          <h3>Ticket listing details</h3>
          <label>
            Event
            <select value={form.eventId} onChange={(e) => updateField("eventId", e.target.value)}>
              <option value="">Select event</option>
              {events.map((event) => (
                <option key={event.eventId} value={event.eventId}>
                  {event.eventName ?? `Event ${event.eventId}`}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ticket type
            <input value={form.ticketType} onChange={(e) => updateField("ticketType", e.target.value)} />
          </label>
          <div className={styles.twoColumns}>
            <label>
              Start date
              <input type="date" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} />
            </label>
            <label>
              End date
              <input type="date" value={form.endDate} onChange={(e) => updateField("endDate", e.target.value)} />
            </label>
          </div>
          <label>
            Price
            <input value={form.price} onChange={(e) => updateField("price", e.target.value)} />
          </label>
          <label>
            Currency
            <select value={form.currency} onChange={(e) => updateField("currency", e.target.value)}>
              <option value="NOK">NOK</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <label>
            Tickets available
            <input
              type="number"
              value={form.ticketsAvailable}
              onChange={(e) => updateField("ticketsAvailable", e.target.value)}
            />
          </label>
        </section>

        <section className={styles.formSection}>
          <h3>Ticket provider</h3>
          <p>
            {companyId
              ? `Creating listing for Company ${companyId}.`
              : "Select one company before creating a ticket listing."}
          </p>
          {/* Requires endpoint: GET /companies/represented */}
          {/* Replace Company ID label with real company name when IAM supports represented companies. */}
        </section>
      </div>

      <div className={styles.dialogActions}>
        {mode === "edit" && (
          <button type="button" className={styles.deleteButton} onClick={handleDelete}>
            Delete
          </button>
        )}

        {mode === "create" ? (
          <button type="submit" className={styles.saveButton} disabled={!companyId}>
            Request
          </button>
        ) : (
          // Requires endpoint: PUT /ticket-listings/{id}
          // <button type="submit" className={styles.saveButton} disabled={!companyId}>
          //   Save
          // </button>
          null
        )}
      </div>
    </form>
  );
}
