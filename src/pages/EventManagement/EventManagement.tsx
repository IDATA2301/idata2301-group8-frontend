import { useMemo, useRef, useState } from "react";
import EventManagementSection from "./EventManagementSection";
import EventDialog from "./EventDialog";
import TicketListingDialog from "./TicketListingDialog";
import styles from "./EventManagement.module.css";
import { useAuthContext } from "@utility/AuthContext";
import { useGetCompanies, type CompanyDto } from "@api/iam";
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

type ActivePopup = Exclude<PopupState, null>;

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("nb-NO") : "-";
}

function formatPrice(price?: number, currency?: string) {
  if (price === undefined || price === null) return "-";
  return `${price} ${currency ?? ""}`.trim();
}

export default function EventManagement() {
  const { user } = useAuthContext();
  const eventDialogRef = useRef<HTMLDialogElement>(null);
  const ticketListingDialogRef = useRef<HTMLDialogElement>(null);
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

  const companyOptions: CompanyDto[] = useMemo(() => {
    const companyIds = Object.entries(user?.companyRoles || {}).map(([companyId]) => companyId);

    return companyIds.reduce((acc: CompanyDto[], companyId) => {
      const company = companies.find((item) => item.id === parseInt(companyId));

      if (company) {
        acc.push(company);
      }

      return acc;
    }, []);
  }, [user?.companyRoles, companies]);

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
    ? "my companies"
    : companyOptions.find((company) => company.id === selectedCompanyId)?.name
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

  function openEventDialog(nextPopup: ActivePopup) {
    setPopup(nextPopup);
    ticketListingDialogRef.current?.close();

    requestAnimationFrame(() => {
      if (!eventDialogRef.current?.open) {
        eventDialogRef.current?.showModal();
      }
    });
  }

  function openTicketListingDialog(nextPopup: ActivePopup) {
    setPopup(nextPopup);
    eventDialogRef.current?.close();

    requestAnimationFrame(() => {
      if (!ticketListingDialogRef.current?.open) {
        ticketListingDialogRef.current?.showModal();
      }
    });
  }

  function closeDialogs() {
    eventDialogRef.current?.close();
    ticketListingDialogRef.current?.close();
    setPopup(null);
  }

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
              <option key="all" value="all">My companies</option>
              {companyOptions.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name ?? `Company ${company.id}`}
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
            onCreate={() => openEventDialog({ type: "event", mode: "create" })}
            onEntryClick={(index) => openEventDialog({
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
            onCreate={() => openTicketListingDialog({ type: "ticketListing", mode: "create" })}
            onEntryClick={(index) => openTicketListingDialog({
              type: "ticketListing",
              mode: "edit",
              ticketListingId: visibleTicketListings[index]?.ticketListingId
            })}
          />
        </div>
      </div>

      <EventDialog
        ref={eventDialogRef}
        mode={popup?.type === "event" ? popup.mode : "create"}
        selectedEvent={selectedEvent}
        onClose={closeDialogs}
        onSuccess={refetchManagementData}
      />

      <TicketListingDialog
        ref={ticketListingDialogRef}
        mode={popup?.type === "ticketListing" ? popup.mode : "create"}
        events={allEvents}
        selectedCompanyId={selectedCompanyId}
        companyOptions={companyOptions}
        selectedTicketListing={selectedTicketListing}
        onClose={closeDialogs}
        onSuccess={refetchManagementData}
      />
    </main>
  );
}
