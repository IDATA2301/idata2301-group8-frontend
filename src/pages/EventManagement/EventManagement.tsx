import { useMemo, useState } from "react";
import EventManagementSection from "./EventManagementSection";
import EventDialog from "./EventDialog";
import TicketListingDialog from "./TicketListingDialog";
import styles from "./EventManagement.module.css";
import { useAuthContext } from "@utility/AuthContext";
import { useGetCompanies } from "@api/iam";
import {
  useGetEvents,
  useGetTicketListings
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

type CompanyRole = {
  companyId?: number;
};

type AuthUserWithCompanyRoles = {
  companyRoles?: CompanyRole[];
};

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("nb-NO") : "-";
}

function formatPrice(price?: number, currency?: string) {
  if (price === undefined || price === null) return "-";
  return `${price} ${currency ?? ""}`.trim();
}

export default function EventManagement() {
  const { user } = useAuthContext();
  const authUser = user as AuthUserWithCompanyRoles | undefined;
  const [selectedCompanyId, setSelectedCompanyId] = useState<SelectedCompanyId>("all");
  const [popup, setPopup] = useState<PopupState>(null);
  const companyIdParam = selectedCompanyId === "all" ? undefined : selectedCompanyId;
  const companiesQuery = useGetCompanies();
  const eventsQuery = useGetEvents({ size: 100 });
  const ticketListingsQuery = useGetTicketListings(
    companyIdParam ? { companyId: companyIdParam } : undefined
  );

  const companiesData = companiesQuery.data?.data;
  const eventsData = eventsQuery.data?.data;
  const ticketListingsData = ticketListingsQuery.data?.data;
  const companies = Array.isArray(companiesData) ? companiesData : [];
  const allEvents =
    typeof eventsData === "object" && Array.isArray(eventsData.content)
      ? eventsData.content
      : [];
  const visibleTicketListings = Array.isArray(ticketListingsData) ? ticketListingsData : [];

  const companyOptions: CompanyOption[] = useMemo(() => {
    const companyRoleIds = Array.from(
      new Set(
        authUser?.companyRoles
          ?.map((role) => role.companyId)
          .filter((companyId): companyId is number => companyId !== undefined) ?? []
      )
    );

    return companyRoleIds.map((companyId) => {
      const company = companies.find((item) => item.id === companyId);

      return {
        companyId,
        companyName: company?.name ?? `Company ${companyId}`
      };
    });
  }, [authUser?.companyRoles, companies]);

  const visibleEvents = useMemo(() => {
    if (selectedCompanyId === "all") {
      return allEvents;
    }

    const eventIds = new Set(visibleTicketListings.map((listing) => listing.eventId));

    return allEvents.filter((event) =>
      event.eventId !== undefined && eventIds.has(event.eventId)
    );
  }, [allEvents, selectedCompanyId, visibleTicketListings]);

  const selectedEvent = popup?.eventId
    ? allEvents.find((event) => event.eventId === popup.eventId)
    : undefined;

  const selectedTicketListing = popup?.ticketListingId
    ? visibleTicketListings.find((listing) => listing.ticketListingId === popup.ticketListingId)
    : undefined;

  const eventNameById = useMemo(() => {
    return new Map(
      allEvents
        .filter((event) => event.eventId !== undefined)
        .map((event) => [event.eventId, event.eventName ?? `Event ${event.eventId}`])
    );
  }, [allEvents]);

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

  const ticketListingRows = visibleTicketListings.map((listing) => {
    const eventName = listing.eventId !== undefined
      ? eventNameById.get(listing.eventId)
      : undefined;

    return [
      listing.ticketListingId ?? "-",
      eventName ?? `Event ${listing.eventId ?? "-"}`,
      listing.ticketType ?? "-",
      formatPrice(listing.price, listing.currency),
      listing.ticketsAvailable ?? "-"
    ];
  });

  function refetchManagementData() {
    eventsQuery.refetch();
    ticketListingsQuery.refetch();
    companiesQuery.refetch();
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

      {popup?.type === "event" && (
        <EventDialog
          isOpen={true}
          mode={popup.mode}
          selectedEvent={selectedEvent}
          onClose={() => setPopup(null)}
          onSuccess={refetchManagementData}
        />
      )}

      {popup?.type === "ticketListing" && (
        <TicketListingDialog
          isOpen={true}
          mode={popup.mode}
          events={allEvents}
          selectedCompanyId={selectedCompanyId}
          companyOptions={companyOptions}
          selectedTicketListing={selectedTicketListing}
          onClose={() => setPopup(null)}
          onSuccess={refetchManagementData}
        />
      )}
    </main>
  );
}
