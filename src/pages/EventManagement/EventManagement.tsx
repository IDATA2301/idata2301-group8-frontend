import { useMemo, useState } from "react";
import EventManagementSection from "./EventManagementSection";
import CreationEditPopup from "./CreationEditPopup";
import styles from "./EventManagement.module.css";
import {
  useGetAllCategories,
  useGetAllVenues,
  useGetRepresentedEvents,
  useGetRepresentedTicketListings
} from "@api/events";

type SelectedCompanyId = "all" | number;

type PopupState = {
  type: "event" | "ticketListing";
  mode: "create" | "edit";
  eventId?: number;
  ticketListingId?: number;
} | null;

type CompanyOption = {
  companyId: number;
  companyName: string;
};

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("nb-NO") : "-";
}

function formatPrice(price?: number, currency?: string) {
  if (price === undefined || price === null) return "-";
  return `${price} ${currency ?? ""}`.trim();
}

export default function EventManagement() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<SelectedCompanyId>("all");
  const [popup, setPopup] = useState<PopupState>(null);

  const companyIdParam = selectedCompanyId === "all" ? undefined : selectedCompanyId;
  const representedEventsQuery = useGetRepresentedEvents({ companyId: companyIdParam });
  const representedTicketListingsQuery = useGetRepresentedTicketListings({ companyId: companyIdParam });
  const allRepresentedTicketListingsQuery = useGetRepresentedTicketListings();
  const venuesQuery = useGetAllVenues();
  const categoriesQuery = useGetAllCategories();

  const visibleEvents = Array.isArray(representedEventsQuery.data?.data)
    ? representedEventsQuery.data.data
    : [];
  const visibleTicketListings = Array.isArray(representedTicketListingsQuery.data?.data)
    ? representedTicketListingsQuery.data.data
    : [];
  const allRepresentedTicketListings = Array.isArray(allRepresentedTicketListingsQuery.data?.data)
    ? allRepresentedTicketListingsQuery.data.data
    : [];
  const venues = Array.isArray(venuesQuery.data?.data) ? venuesQuery.data.data : [];
  const categories = Array.isArray(categoriesQuery.data?.data) ? categoriesQuery.data.data : [];

  const selectedEvent = popup?.eventId
    ? visibleEvents.find((event) => event.eventId === popup.eventId)
    : undefined;
  const selectedTicketListing = popup?.ticketListingId
    ? visibleTicketListings.find((listing) => listing.ticketListingId === popup.ticketListingId)
    : undefined;

  const eventNameById = useMemo(() => {
    return new Map(
      visibleEvents
        .filter((event) => event.eventId !== undefined)
        .map((event) => [event.eventId, event.eventName ?? `Event ${event.eventId}`])
    );
  }, [visibleEvents]);

  // Requires endpoint: GET /companies/represented
  // Event-service only knows companyId. IAM-service owns company names and represented-company access.
  const companyOptions: CompanyOption[] = useMemo(() => {
    const companyIds = Array.from(
      new Set(
        allRepresentedTicketListings
          .map((listing) => listing.companyId)
          .filter((companyId): companyId is number => companyId !== undefined)
      )
    );

    return companyIds.map((companyId) => ({
      companyId,
      companyName: `Company ${companyId}`
    }));
  }, [allRepresentedTicketListings]);

  const selectedCompanyName = selectedCompanyId === "all"
    ? "all companies"
    : companyOptions.find((company) => company.companyId === selectedCompanyId)?.companyName
    ?? "selected company";

  const eventRows = visibleEvents.map((event) => [
    event.eventId ?? "-",
    event.eventName ?? "-",
    event.status ?? "-",
    event.venueName ?? "-",
    formatDate(event.createdAt)
  ]);

  const ticketListingRows = visibleTicketListings.map((listing) => [
    listing.ticketListingId ?? "-",
    eventNameById.get(listing.eventId) ?? `Event ${listing.eventId ?? "-"}`,
    listing.ticketType ?? "-",
    formatPrice(listing.price, listing.currency),
    listing.ticketsAvailable ?? "-"
  ]);

  function refetchManagementData() {
    representedEventsQuery.refetch();
    representedTicketListingsQuery.refetch();
    allRepresentedTicketListingsQuery.refetch();
    venuesQuery.refetch();
    categoriesQuery.refetch();
  }

  return (
    <main className={styles.eventManagementPage}>
      <div className={styles.pageContent}>
        <header className={styles.pageHeader}>
          <div>
            <h1>Event management</h1>
          </div>
          <div className={styles.companySelector}>
            <label htmlFor="company-select">Managing company</label>
            <select
              id="company-select"
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )}
            >
              <option value="all">All companies</option>
              {companyOptions.map((company) => (
                <option key={company.companyId} value={company.companyId}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className={styles.sectionsGrid}>
          <EventManagementSection
            title={`Events with listings from ${selectedCompanyName}`}
            buttonText="Create event"
            headers={["event_id", "event_name", "status", "venue", "created_at"]}
            entries={eventRows}
            onCreate={() => setPopup({ type: "event", mode: "create" })}
            onEntryClick={(index) => setPopup({
              type: "event",
              mode: "edit",
              eventId: visibleEvents[index]?.eventId
            })}
          />

          <EventManagementSection
            title={`Ticket listings for ${selectedCompanyName}`}
            buttonText="Create ticket listing"
            headers={["listing_id", "event_name", "ticket_type", "price", "available"]}
            entries={ticketListingRows}
            onCreate={() => setPopup({ type: "ticketListing", mode: "create" })}
            onEntryClick={(index) => setPopup({
              type: "ticketListing",
              mode: "edit",
              ticketListingId: visibleTicketListings[index]?.ticketListingId
            })}
          />
        </div>
      </div>

      {popup && (
        <CreationEditPopup
          type={popup.type}
          mode={popup.mode}
          events={visibleEvents}
          venues={venues}
          categories={categories}
          selectedCompanyId={selectedCompanyId}
          selectedEvent={selectedEvent}
          selectedTicketListing={selectedTicketListing}
          onClose={() => setPopup(null)}
          onSuccess={refetchManagementData}
        />
      )}
    </main>
  );
}
