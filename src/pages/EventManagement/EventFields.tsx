import { useState } from "react";
import styles from "./CreationEditPopup.module.css";
import type { CategoryResponse, CreateEventRequest, EventResponse, VenueResponse } from "@api/events";
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from "@api/events";

type EventFieldsProps = {
  mode: "create" | "edit";
  venues: VenueResponse[];
  categories: CategoryResponse[];
  selectedEvent?: EventResponse;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EventFields({
  mode,
  venues,
  categories,
  selectedEvent,
  onClose,
  onSuccess
}: EventFieldsProps) {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [eventImage, setEventImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    eventName: selectedEvent?.eventName ?? "",
    slug: selectedEvent?.slug ?? "",
    description: selectedEvent?.description ?? "",
    imageUrl: selectedEvent?.imageUrl ?? "",
    status: selectedEvent?.status ?? "active",
    venueId: selectedEvent?.venueId?.toString() ?? venues[0]?.venueId?.toString() ?? "",
    categoryIds: ""
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function buildRequest(): CreateEventRequest {
    const categoryIds = form.categoryIds
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !Number.isNaN(id));

    return {
      eventName: form.eventName,
      slug: form.slug,
      description: form.description,
      imageUrl: form.imageUrl,
      status: form.status,
      venueId: Number(form.venueId),
      categoryIds
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === "edit" && selectedEvent?.eventId) {
      updateEvent.mutate({ id: selectedEvent.eventId, data: buildRequest() }, { onSuccess: handleSuccess });
      return;
    }

    if (!eventImage) return;
    createEvent.mutate({ data: { eventData: buildRequest(), eventImage } }, { onSuccess: handleSuccess });
  }

  function handleDelete() {
    if (!selectedEvent?.eventId) return;
    deleteEvent.mutate({ id: selectedEvent.eventId }, { onSuccess: handleSuccess });
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
            <input value={form.eventName} onChange={(e) => updateField("eventName", e.target.value)} />
          </label>
          <label>
            Slug
            <input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} />
          </label>
          {mode === "create" && (
            <label>
              Image file
              <input type="file" accept="image/*" onChange={(e) => setEventImage(e.target.files?.[0] ?? null)} />
            </label>
          )}
          {mode === "edit" && (
            <label>
              Image URL
              <input value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} />
            </label>
          )}
          <label>
            Description
            <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
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
            <select value={form.venueId} onChange={(e) => updateField("venueId", e.target.value)}>
              <option value="">Select venue</option>
              {venues.map((venue) => (
                <option key={venue.venueId} value={venue.venueId}>
                  {venue.venueName ?? `Venue ${venue.venueId}`}
                </option>
              ))}
            </select>
          </label>
          <label>
            Category IDs
            <input
              value={form.categoryIds}
              onChange={(e) => updateField("categoryIds", e.target.value)}
              placeholder={categories.map((category) => category.categoryId).filter(Boolean).join(", ")}
            />
          </label>
        </section>
      </div>

      <div className={styles.dialogActions}>
        {mode === "edit" && (
          <button type="button" className={styles.deleteButton} onClick={handleDelete}>
            Delete
          </button>
        )}
        <button type="submit" className={styles.saveButton} disabled={mode === "create" && !eventImage}>
          {mode === "create" ? "Create" : "Save"}
        </button>
      </div>
    </form>
  );
}
