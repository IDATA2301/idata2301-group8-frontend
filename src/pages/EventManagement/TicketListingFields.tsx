import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./DialogForm.module.css";
import toast from "@components/Toast";
import { useConfirm } from "@utility/ConfirmContext";
import type { CompanyDto } from "@api/iam";
import type {
  CreateTicketListingRequest,
  EventResponse,
  TicketListingResponse
} from "@api/events";
import {
  useCreateTicketListing,
  useDeleteTicketListing,
  useUpdateTicketListing
} from "@api/events";

type SelectedCompanyId = "all" | number;

type TicketListingFieldsProps = {
  mode: "create" | "edit";
  events: EventResponse[];
  selectedCompanyId: SelectedCompanyId;
  companyOptions: CompanyDto[];
  selectedTicketListing?: TicketListingResponse;
  onClose: () => void;
  onSuccess: () => void;
};

export default function TicketListingFields({
  mode,
  events,
  selectedCompanyId,
  companyOptions,
  selectedTicketListing,
  onClose,
  onSuccess
}: TicketListingFieldsProps) {
  const initialCompanyId =
    selectedTicketListing?.companyId ??
    (selectedCompanyId === "all" ? companyOptions[0]?.id : selectedCompanyId);

  const [selectedListingCompanyId, setSelectedListingCompanyId] = useState<number | undefined>(
    initialCompanyId
  );

  const { confirm } = useConfirm();
  const createTicketListing = useCreateTicketListing();
  const updateTicketListing = useUpdateTicketListing();
  const deleteTicketListing = useDeleteTicketListing();

  const [form, setForm] = useState({
    eventId: selectedTicketListing?.eventId?.toString() ?? "",
    ticketType: selectedTicketListing?.ticketType ?? "",
    startDate: selectedTicketListing?.startDate?.slice(0, 10) ?? "",
    endDate: selectedTicketListing?.endDate?.slice(0, 10) ?? "",
    price: selectedTicketListing?.price?.toString() ?? "",
    currency: selectedTicketListing?.currency ?? "NOK",
    ticketsAvailable: selectedTicketListing?.ticketsAvailable?.toString() ?? ""
  });

  const isSubmitting =
    createTicketListing.isPending ||
    updateTicketListing.isPending ||
    deleteTicketListing.isPending;

  const selectedCompanyName =
    companyOptions.find((company) => company.id === selectedListingCompanyId)?.name
    ?? `Company ${selectedListingCompanyId ?? "-"}`;

  const selectedEvent = events.find((event) => event.eventId === Number(form.eventId));

  const hasValidCompany = selectedListingCompanyId !== undefined;
  const hasValidEvent = form.eventId.trim().length > 0 && !Number.isNaN(Number(form.eventId));
  const hasValidTicketType = form.ticketType.trim().length > 0;
  const hasValidPrice = form.price.trim().length > 0 && !Number.isNaN(Number(form.price));
  const hasValidTicketsAvailable =
    form.ticketsAvailable.trim().length > 0 &&
    !Number.isNaN(Number(form.ticketsAvailable));
  const canSubmit =
    hasValidCompany &&
    hasValidEvent &&
    hasValidTicketType &&
    hasValidPrice &&
    hasValidTicketsAvailable &&
    !isSubmitting;

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function buildRequest(): CreateTicketListingRequest {
    return {
      eventId: Number(form.eventId),
      companyId: selectedListingCompanyId,
      ticketType: form.ticketType.trim(),
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      price: Number(form.price),
      currency: form.currency,
      ticketsAvailable: Number(form.ticketsAvailable)
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (mode === "edit" && selectedTicketListing?.ticketListingId) {
      updateTicketListing.mutate(
        {
          id: selectedTicketListing.ticketListingId,
          data: buildRequest()
        },
        {
          onSuccess: () => {
            toast.success("Ticket listing updated successfully");
            handleSuccess();
          },
          onError: () => {
            toast.error("Failed to update ticket listing");
          }
        }
      );
      return;
    }

    createTicketListing.mutate(
      { data: buildRequest() },
      {
        onSuccess: () => {
          toast.success("Ticket listing created successfully");
          handleSuccess();
        },
        onError: () => {
          toast.error("Failed to create ticket listing");
        }
      }
    );
  }

  async function handleDelete() {
    if (!selectedTicketListing?.ticketListingId || isSubmitting) {
      return;
    }

    const ticketName = selectedTicketListing.ticketType
      ? `"${selectedTicketListing.ticketType}"`
      : "this ticket listing";

    const shouldDelete = await confirm({
      title: "Delete ticket listing?",
      message: `Are you sure you want to delete ${ticketName}? This action cannot be undone.`,
      confirmText: "Delete",
      isDanger: true
    });

    if (!shouldDelete) {
      return;
    }

    deleteTicketListing.mutate(
      { id: selectedTicketListing.ticketListingId },
      {
        onSuccess: () => {
          toast.success("Ticket listing deleted successfully");
          handleSuccess();
        },
        onError: () => {
          toast.error("Failed to delete ticket listing");
        }
      }
    );
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
            <select
              value={form.eventId}
              required
              disabled={isSubmitting}
              onChange={(e) => updateField("eventId", e.target.value)}
            >
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
            <input
              value={form.ticketType}
              required
              disabled={isSubmitting}
              onChange={(e) => updateField("ticketType", e.target.value)}
            />
          </label>

          <div className={styles.twoColumns}>
            <label>
              Start date
              <input
                type="date"
                value={form.startDate}
                disabled={isSubmitting}
                onChange={(e) => updateField("startDate", e.target.value)}
              />
            </label>

            <label>
              End date
              <input
                type="date"
                value={form.endDate}
                disabled={isSubmitting}
                onChange={(e) => updateField("endDate", e.target.value)}
              />
            </label>
          </div>

          <label>
            Price
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              required
              disabled={isSubmitting}
              onChange={(e) => updateField("price", e.target.value)}
            />
          </label>

          <label>
            Currency
            <select
              value={form.currency}
              disabled={isSubmitting}
              onChange={(e) => updateField("currency", e.target.value)}
            >
              <option value="NOK">NOK</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </label>

          <label>
            Tickets available
            <input
              type="number"
              min="0"
              value={form.ticketsAvailable}
              required
              disabled={isSubmitting || mode === "edit"}
              onChange={(e) => updateField("ticketsAvailable", e.target.value)}
            />
          </label>

          {mode === "edit" && (
            <p className={styles.helperText}>
              Ticket amount cannot be changed after the listing is created.
            </p>
          )}
        </section>

        <section className={styles.formSection}>
          <h3>Ticket provider</h3>

          {mode === "create" ? (
            <>
              <label>
                Company
                <select
                  value={selectedListingCompanyId ?? ""}
                  required
                  disabled={isSubmitting}
                  onChange={(e) => setSelectedListingCompanyId(
                    e.target.value ? Number(e.target.value) : undefined
                  )}
                >
                  <option value="">Select company</option>
                  {companyOptions.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name ?? `Company ${company.id}`}
                    </option>
                  ))}
                </select>
              </label>

              <p className={styles.helperText}>
                This company will be saved on the ticket listing.
              </p>
            </>
          ) : (
            <p className={styles.helperText}>
              Listing company: {selectedCompanyName}. Company cannot be changed after the listing is created.
            </p>
          )}
        </section>
      </div>

      <div className={styles.dialogActions}>
        {mode === "edit" && selectedEvent?.slug && (
          <Link
            to={`/events/${selectedEvent.slug}`}
            className={styles.secondaryButton}
            onClick={onClose}
          >
            Go to page
          </Link>
        )}

        <button
          type="button"
          className={styles.cancelButton}
          disabled={isSubmitting}
          onClick={onClose}
        >
          Cancel
        </button>

        {mode === "edit" && (
          <button
            type="button"
            className={styles.deleteButton}
            disabled={isSubmitting}
            onClick={handleDelete}
          >
            Delete
          </button>
        )}

        <button
          type="submit"
          className={styles.saveButton}
          disabled={!canSubmit}
        >
          {mode === "create" ? "Create" : "Save"}
        </button>
      </div>
    </form>
  );
}
