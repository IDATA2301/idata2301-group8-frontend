import { useMemo, useRef, useState } from "react";
import EventManagementSection, { type SortOption } from "./EventManagementSection";
import EventDialog from "./EventDialog";
import TicketListingDialog from "./TicketListingDialog";
import VenueDialog from "./VenueDialog";
import styles from "./EventManagement.module.css";
import { useAuthContext } from "@utility/AuthContext";
import { useGetCompanies, type CompanyDto } from "@api/iam";
import {
  useGetAllVenues,
  useGetEvents,
  useGetTicketListings
} from "@api/events";

type SelectedCompanyId = "all" | number;

type PopupState = {
  type: "event" | "ticketListing" | "venue";
  mode: "create" | "edit";
  eventId?: number;
  ticketListingId?: number;
  venueId?: number;
} | null;

type ActivePopup = Exclude<PopupState, null>;

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("nb-NO") : "-";
}

function formatPrice(price?: number, currency?: string) {
  if (price === undefined || price === null) return "-";
  return `${price} ${currency ?? ""}`.trim();
}

function formatLocation(city?: string, country?: string) {
  return [city, country].filter(Boolean).join(", ") || "-";
}

function isExpired(startDate?: string): boolean {
  if (!startDate) return false;
  return new Date(startDate) < new Date();
}

export default function EventManagement() {
  const { user, isAdmin } = useAuthContext();
  const eventDialogRef = useRef<HTMLDialogElement>(null);
  const ticketListingDialogRef = useRef<HTMLDialogElement>(null);
  const venueDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<SelectedCompanyId>("all");
  const [popup, setPopup] = useState<PopupState>(null);
  const [eventSearch, setEventSearch] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");
  const [venueSearch, setVenueSearch] = useState("");
  const [eventSort, setEventSort] = useState<SortOption>("default");
  const [ticketSort, setTicketSort] = useState<SortOption>("default");
  const companyIdParam = selectedCompanyId === "all" ? undefined : selectedCompanyId;
  const companiesQuery = useGetCompanies();
  const eventsQuery = useGetEvents({ size: 100 });
  const venuesQuery = useGetAllVenues();
  const ticketListingsQuery = useGetTicketListings(
    companyIdParam ? { companyId: companyIdParam } : undefined
  );

  const companiesData = companiesQuery.data?.data;
  const eventsData = eventsQuery.data?.data;
  const venuesData = venuesQuery.data?.data;
  const ticketListingsData = ticketListingsQuery.data?.data;
  const companies = Array.isArray(companiesData) ? companiesData : [];
  const venues = Array.isArray(venuesData) ? venuesData : [];
  const allEvents =
    typeof eventsData === "object" && Array.isArray(eventsData.content)
      ? eventsData.content
      : [];
  const visibleTicketListings = Array.isArray(ticketListingsData) ? ticketListingsData : [];

  const companyOptions: CompanyDto[] = useMemo(() => {
    if (isAdmin) {
      return companies;
    }

    const companyIds = Object.keys(user?.companyRoles || {});

    return companyIds.reduce((acc: CompanyDto[], companyId) => {
      const company = companies.find((item) => item.id === Number(companyId));

      if (company) {
        acc.push(company);
      }

      return acc;
    }, []);
  }, [isAdmin, user?.companyRoles, companies]);

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

  const selectedVenue = popup?.venueId
    ? venues.find((venue) => venue.id === popup.venueId)
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

  const filteredEvents = useMemo(() => {
    let result = visibleEvents;

    if (eventSearch.trim()) {
      const search = eventSearch.toLowerCase();
      result = result.filter((event) =>
        (event.eventName?.toLowerCase().includes(search)) ||
        (event.status?.toLowerCase().includes(search)) ||
        (event.city?.toLowerCase().includes(search)) ||
        (event.country?.toLowerCase().includes(search)) ||
        (String(event.eventId).includes(search))
      );
    }

    if (eventSort !== "default") {
      result = [...result].sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return eventSort === "soonest" ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }, [visibleEvents, eventSearch, eventSort]);

  const eventStartDateById = useMemo(() => {
    return new Map(
      allEvents
        .filter((event) => event.eventId !== undefined)
        .map((event) => [event.eventId, event.startDate])
    );
  }, [allEvents]);

  const filteredTicketListings = useMemo(() => {
    let result = visibleTicketListings;

    if (ticketSearch.trim()) {
      const search = ticketSearch.toLowerCase();
      result = result.filter((listing) => {
        const eventName = listing.eventId !== undefined
          ? eventNameById.get(listing.eventId)?.toLowerCase()
          : undefined;
        return (
          (eventName?.includes(search)) ||
          (listing.ticketType?.toLowerCase().includes(search)) ||
          (String(listing.ticketListingId).includes(search)) ||
          (String(listing.price).includes(search))
        );
      });
    }

    if (ticketSort !== "default") {
      result = [...result].sort((a, b) => {
        const dateA = a.eventId !== undefined && eventStartDateById.get(a.eventId)
          ? new Date(eventStartDateById.get(a.eventId)!).getTime()
          : 0;
        const dateB = b.eventId !== undefined && eventStartDateById.get(b.eventId)
          ? new Date(eventStartDateById.get(b.eventId)!).getTime()
          : 0;
        return ticketSort === "soonest" ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }, [visibleTicketListings, ticketSearch, eventNameById, ticketSort, eventStartDateById]);

  const filteredVenues = useMemo(() => {
    if (!venueSearch.trim()) return venues;
    const search = venueSearch.toLowerCase();
    return venues.filter((venue) =>
      (venue.name?.toLowerCase().includes(search)) ||
      (venue.city?.toLowerCase().includes(search)) ||
      (venue.country?.toLowerCase().includes(search)) ||
      (String(venue.id).includes(search))
    );
  }, [venues, venueSearch]);

  const eventRows = filteredEvents.map((event) => {
    const expired = isExpired(event.startDate);
    return [
      event.eventId ?? "-",
      event.eventName ?? "-",
      expired ? "expired" : "upcoming",
      formatLocation(event.city, event.country),
      formatDate(event.createdAt),
      expired ? (
        <span className={styles.expiredIndicator} title="Event has ended" />
      ) : (
        <span className={styles.notExpiredIndicator} />
      )
    ];
  });

  const ticketListingRows = filteredTicketListings.map((listing) => {
    const eventName = listing.eventId !== undefined
      ? eventNameById.get(listing.eventId)
      : undefined;
    const eventStartDate = listing.eventId !== undefined
      ? eventStartDateById.get(listing.eventId)
      : undefined;

    return [
      listing.ticketListingId ?? "-",
      eventName ?? `Event ${listing.eventId ?? "-"}`,
      listing.ticketType ?? "-",
      formatPrice(listing.price, listing.currency),
      listing.ticketsAvailable ?? "-",
      isExpired(eventStartDate) ? (
        <span className={styles.expiredIndicator} title="Event has ended" />
      ) : (
        <span className={styles.notExpiredIndicator} />
      )
    ];
  });

  const venueRows = filteredVenues.map((venue) => [
    venue.id ?? "-",
    venue.name ?? "-",
    venue.city ?? "-",
    venue.country ?? "-"
  ]);

  function closeAllDialogs() {
    eventDialogRef.current?.close();
    ticketListingDialogRef.current?.close();
    venueDialogRef.current?.close();
  }

  function openEventDialog(nextPopup: ActivePopup) {
    setPopup(nextPopup);
    closeAllDialogs();

    requestAnimationFrame(() => {
      if (!eventDialogRef.current?.open) {
        eventDialogRef.current?.showModal();
      }
    });
  }

  function openTicketListingDialog(nextPopup: ActivePopup) {
    setPopup(nextPopup);
    closeAllDialogs();

    requestAnimationFrame(() => {
      if (!ticketListingDialogRef.current?.open) {
        ticketListingDialogRef.current?.showModal();
      }
    });
  }

  function openVenueDialog(nextPopup: ActivePopup) {
    setPopup(nextPopup);
    closeAllDialogs();

    requestAnimationFrame(() => {
      if (!venueDialogRef.current?.open) {
        venueDialogRef.current?.showModal();
      }
    });
  }

  function closeDialogs() {
    closeAllDialogs();
    setPopup(null);
  }

  function refetchManagementData() {
    eventsQuery.refetch();
    ticketListingsQuery.refetch();
    companiesQuery.refetch();
    venuesQuery.refetch();
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
            headers={["event_id", "event_name", "status", "location", "created_at", "expired"]}
            entries={eventRows}
            onCreate={() => openEventDialog({ type: "event", mode: "create" })}
            onEntryClick={(index) => openEventDialog({
              type: "event",
              mode: "edit",
              eventId: filteredEvents[index]?.eventId
            })}
            searchValue={eventSearch}
            onSearchChange={setEventSearch}
            searchPlaceholder="Search events..."
            sortValue={eventSort}
            onSortChange={setEventSort}
            showSort
          />

          <EventManagementSection
            title={`Ticket listings for ${selectedCompanyName}`}
            buttonText="Create ticket listing"
            headers={["listing_id", "event_name", "ticket_type", "price", "available", "expired"]}
            entries={ticketListingRows}
            onCreate={() => openTicketListingDialog({ type: "ticketListing", mode: "create" })}
            onEntryClick={(index) => openTicketListingDialog({
              type: "ticketListing",
              mode: "edit",
              ticketListingId: filteredTicketListings[index]?.ticketListingId
            })}
            searchValue={ticketSearch}
            onSearchChange={setTicketSearch}
            searchPlaceholder="Search tickets..."
            sortValue={ticketSort}
            onSortChange={setTicketSort}
            showSort
          />

          <EventManagementSection
            title="Venues"
            buttonText="Create venue"
            headers={["venue_id", "venue_name", "city", "country"]}
            entries={venueRows}
            onCreate={() => openVenueDialog({ type: "venue", mode: "create" })}
            onEntryClick={(index) => openVenueDialog({
              type: "venue",
              mode: "edit",
              venueId: filteredVenues[index]?.id
            })}
            searchValue={venueSearch}
            onSearchChange={setVenueSearch}
            searchPlaceholder="Search venues..."
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

      <VenueDialog
        ref={venueDialogRef}
        mode={popup?.type === "venue" ? popup.mode : "create"}
        selectedVenue={selectedVenue}
        onClose={closeDialogs}
        onSuccess={refetchManagementData}
      />
    </main>
  );
}
