import { useState, useMemo } from "react";
import styles from "./DialogForm.module.css";
import toast from "@components/Toast";
import { useCreate, useUpdate, type VenueResponse } from "@api/events";

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
  const updateVenue = useUpdate();
  const [form, setForm] = useState({
    name: selectedVenue?.name ?? "",
    city: selectedVenue?.city ?? "",
    country: selectedVenue?.country ?? ""
  });

  const isSubmitting = createVenue.isPending || updateVenue.isPending;
  const canSubmit =
    form.name.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.country.trim().length > 0 &&
    !isSubmitting;

  const mapQuery = useMemo(() => {
    const name = form.name.trim();
    const city = form.city.trim();
    const country = form.country.trim();

    if (name && city) {
      return `${name}, ${city}`;
    }
    if (city && country) {
      return `${city}, ${country}`;
    }
    if (city) {
      return city;
    }
    return "";
  }, [form.name, form.city, form.country]);

  const iframeUrl = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
    : "";

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

    return mode === "create" ? "Failed to create venue" : "Failed to update venue";
  }

  function handleSuccessResponse(response: { status: number; data: unknown }) {
    if (response.status >= 200 && response.status < 300) {
      toast.success(mode === "create" ? "Venue created successfully" : "Venue updated successfully");
      onSuccess();
      onClose();
      return;
    }

    toast.error(getErrorMessage(response.data));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    const data = {
      name: form.name.trim(),
      city: form.city.trim(),
      country: form.country.trim()
    };

    if (mode === "edit") {
      if (!selectedVenue?.id) {
        toast.error("No venue selected");
        return;
      }

      updateVenue.mutate(
        {
          id: selectedVenue.id,
          data
        },
        {
          onSuccess: handleSuccessResponse,
          onError: (error) => {
            console.error("Failed to update venue:", error);
            toast.error(typeof error === "string" ? error : "Failed to update venue");
          }
        }
      );
      return;
    }

    createVenue.mutate(
      { data },
      {
        onSuccess: handleSuccessResponse,
        onError: (error) => {
          console.error("Failed to create venue:", error);
          toast.error(typeof error === "string" ? error : "Failed to create venue");
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
              placeholder="e.g. Oslo Spektrum"
              onChange={(e) => updateField("name", e.target.value)}
            />
          </label>

          <label>
            City
            <input
              value={form.city}
              required
              disabled={isSubmitting}
              placeholder="e.g. Oslo"
              onChange={(e) => updateField("city", e.target.value)}
            />
          </label>

          <label>
            Country
            <input
              value={form.country}
              required
              disabled={isSubmitting}
              placeholder="e.g. Norway"
              onChange={(e) => updateField("country", e.target.value)}
            />
          </label>
        </section>

        <section className={styles.formSection}>
          <h3>Location preview</h3>
          <p className={styles.helperText}>
            Verify the venue appears correctly on the map
          </p>
          {iframeUrl ? (
            <iframe
              className={styles.mapPreview}
              src={iframeUrl}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className={styles.mapPlaceholder}>
              Enter venue name and city to see preview
            </div>
          )}
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
