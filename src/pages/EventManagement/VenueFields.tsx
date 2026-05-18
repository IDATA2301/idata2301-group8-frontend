import { useState } from "react";
import styles from "./DialogForm.module.css";
import toast from "@components/Toast";
import { useCreate } from "@api/events";

type VenueFieldsProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function VenueFields({
  onClose,
  onSuccess
}: VenueFieldsProps) {
  const createVenue = useCreate();
  const [form, setForm] = useState({
    name: "",
    city: "",
    country: ""
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canSubmit) {
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

          if (typeof response.data === "string") {
            toast.error(response.data);
            return;
          }

          toast.error("Failed to create venue");
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
          Create
        </button>
      </div>
    </form>
  );
}
