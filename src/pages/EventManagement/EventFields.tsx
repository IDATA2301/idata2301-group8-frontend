import { useState } from "react";
import styles from "./DialogForm.module.css";
import type {
  CategoryResponse,
  CreateEventRequest,
  EventResponse,
  VenueResponse
} from "@api/events";
import {
  useCreateEvent,
  useDeleteEvent,
  useUpdateEvent
} from "@api/events";

type EventFieldsProps = {
  mode: "create" | "edit";
  venues: VenueResponse[];
  categories: CategoryResponse[];
  selectedEvent?: EventResponse;
  onClose: () => void;
  onSuccess: () => void;
  onCreateVenue?: (venueName: string) => Promise<VenueResponse | void>;
};

export default function EventFields({
  mode,
  venues,
  categories,
  selectedEvent,
  onClose,
  onSuccess,
  onCreateVenue
}: EventFieldsProps) {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [venueOptions, setVenueOptions] = useState<VenueResponse[]>(venues);
  const [newVenueName, setNewVenueName] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    selectedEvent?.categoryIds ?? []
  );
  const [form, setForm] = useState({
    eventName: selectedEvent?.eventName ?? "",
    description: selectedEvent?.description ?? "",
    status: selectedEvent?.status ?? "active",
    venueId: selectedEvent?.venueId?.toString() ?? venues[0]?.venueId?.toString() ?? ""
  });

  const isSubmitting = createEvent.isPending || updateEvent.isPending || deleteEvent.isPending;
  const hasValidTitle = form.eventName.trim().length > 0;
  const hasValidVenue = form.venueId.trim().length > 0 && !Number.isNaN(Number(form.venueId));
  const hasRequiredImage = mode === "edit" || eventImage !== null;
  const canSubmit = hasValidTitle && hasValidVenue && hasRequiredImage && !isSubmitting;

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleCategory(categoryId?: number) {
    if (categoryId === undefined) {
      return;
    }

    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  }

  function removeCategory(categoryId: number) {
    setSelectedCategoryIds((current) => current.filter((id) => id !== categoryId));
  }

  function buildRequest(): CreateEventRequest {
    return {
      eventName: form.eventName.trim(),
      description: form.description,
      status: form.status,
      venueId: Number(form.venueId),
      categoryIds: selectedCategoryIds
    };
  }

  async function handleCreateVenue() {
    const venueName = newVenueName.trim();

    if (!venueName || !onCreateVenue) {
      return;
    }

    const createdVenue = await onCreateVenue(venueName);

    if (createdVenue?.venueId) {
      setVenueOptions((current) => [...current, createdVenue]);
      updateField("venueId", createdVenue.venueId.toString());
    }

    setNewVenueName("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (mode === "edit" && selectedEvent?.eventId) {
      updateEvent.mutate(
        {
          id: selectedEvent.eventId,
          data: {
            eventData: buildRequest(),
            eventImage: eventImage ?? undefined
          }
        },
        { onSuccess: handleSuccess }
      );
      return;
    }

    if (!eventImage) {
      return;
    }

    createEvent.mutate(
      {
        data: {
          eventData: buildRequest(),
          eventImage
        }
      },
      { onSuccess: handleSuccess }
    );
  }

  function handleDelete() {
    if (!selectedEvent?.eventId || isSubmitting) {
      return;
    }

    deleteEvent.mutate(
      { id: selectedEvent.eventId },
      { onSuccess: handleSuccess }
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
          <h3>Event details</h3>

          <label>
            Event name
            <input
              value={form.eventName}
              required
              disabled={isSubmitting}
              onChange={(e) => updateField("eventName", e.target.value)}
            />
          </label>

          <label>
            Image file
            <input
              type="file"
              accept="image/*"
              required={mode === "create"}
              disabled={isSubmitting}
              onChange={(e) => setEventImage(e.target.files?.[0] ?? null)}
            />
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              disabled={isSubmitting}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </label>

          <label>
            Status
            <select
              value={form.status}
              disabled={isSubmitting}
              onChange={(e) => updateField("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
              <option value="featured">Featured</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </section>

        <section className={styles.formSection}>
          <h3>Venue and categories</h3>

          <label>
            Venue
            <select
              value={form.venueId}
              required
              disabled={isSubmitting}
              onChange={(e) => updateField("venueId", e.target.value)}
            >
              <option value="">Select venue</option>
              {venueOptions.map((venue) => (
                <option key={venue.venueId} value={venue.venueId}>
                  {venue.venueName ?? `Venue ${venue.venueId}`}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.inlineCreate}>
            <label>
              New venue
              <input
                value={newVenueName}
                disabled={isSubmitting}
                onChange={(e) => setNewVenueName(e.target.value)}
                placeholder="Venue name"
              />
            </label>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleCreateVenue}
              disabled={!newVenueName.trim() || !onCreateVenue || isSubmitting}
            >
              Add venue
            </button>
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Categories</span>

            <div className={styles.categoryList}>
              {categories.map((category) => {
                const categoryId = category.categoryId;
                const checked = categoryId !== undefined && selectedCategoryIds.includes(categoryId);

                return (
                  <label key={categoryId} className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isSubmitting}
                      onChange={() => toggleCategory(categoryId)}
                    />
                    {category.categoryName ?? `Category ${categoryId}`}
                  </label>
                );
              })}
            </div>

            <div className={styles.selectedChips}>
              {selectedCategoryIds.map((categoryId) => {
                const category = categories.find((item) => item.categoryId === categoryId);

                return (
                  <button
                    key={categoryId}
                    type="button"
                    className={styles.chip}
                    disabled={isSubmitting}
                    onClick={() => removeCategory(categoryId)}
                  >
                    {category?.categoryName ?? `Category ${categoryId}`} ×
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <div className={styles.dialogActions}>
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
