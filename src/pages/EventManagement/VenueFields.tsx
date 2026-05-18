import { useState } from "react";
import styles from "./DialogForm.module.css";
import toast from "@components/Toast";
import { useCreate, type VenueResponse } from "@api/events";

type VenueFieldsProps = {
  mode: "create" | "edit";
  selectedVenue?: VenueResponse;
  onClose: () => void;
  onSuccess: () => void;
};

export default function VenueFields({
  mode,
  selectedVenue,
  onClose,
  onSuccess
}: VenueFieldsProps) {
  const createVenue = useCreate();
  const [form, setForm] = useState({
    name: selectedVenue?.name ?? "",
    city: selectedVenue?.city ?? "",
    country: selectedVenue?.country ?? ""
  });

  const isSubmitting = createVenue.isPending;
  const canSubmit =
    form.name.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.country.trim().length > 0 &&
    !isSubmitting;

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function getErrorMessage(data: unknown) {
    if (typeof data === "string") {
      return data;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
    ) {
      return data.error;
    }

    return "Failed to create venue";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (mode === "edit") {
      toast.error("Venue editing is not supported by the generated API yet");
      return;
    }

    createVenue.mutate(
      {
        data: {
          name: form.name.trim(),
          city: form.city.trim(),
          country: form.country.trim()
        }
      },
      {
        onSuccess: (response) => {
          if (response.status >= 200 && response.status < 300) {
            toast.success("Venue created successfully");
            onSuccess();
            onClose();
            return;
          }

          toast.error(getErrorMessage(response.data));
        },
        onError: (error) => {
          console.error("Failed to create venue:", error);
          toast.error("Failed to create venue");
        }
      }
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.dialogGrid}>
        <section className={styles.formSection}>
          <h3>Venue details</h3>

          <label>
            Venue name
            <input
              value={form.name}
              required
              disabled={isSubmitting}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </label>

          <label>
            City
            <input
              value={form.city}
              required
              disabled={isSubmitting}
              onChange={(e) => updateField("city", e.target.value)}
            />
          </label>

          <label>
            Country
            <input
              value={form.country}
              required
              disabled={isSubmitting}
              onChange={(e) => updateField("country", e.target.value)}
            />
          </label>
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
