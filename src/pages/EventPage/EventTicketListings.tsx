import {
  useGetTicketListings,
  type TicketListingResponse
} from "@api/events";
import ChooseTickets from "./ChooseTickets";

interface Props {
  eventId?: number;
  eventName: string;
}

type TicketListingWithCompany = TicketListingResponse & {
  companyName?: string | null;
  company?: {
    name?: string | null;
  } | null;
};

export default function EventTicketListings({ eventId, eventName }: Props) {
  const {
    data: listingsResponse,
    isLoading,
    isError
  } = useGetTicketListings(
    { eventId },
    {
      query: {
        enabled: !!eventId
      }
    }
  );

  const listings =
    listingsResponse?.status === 200
      ? listingsResponse.data
      : [];

  const tickets = listings
    .filter((listing: TicketListingResponse) => listing.ticketListingId != null)
    .map((listing: TicketListingWithCompany) => ({
      id: listing.ticketListingId!,
      name: listing.ticketType ?? "Ticket",
      price: listing.price ?? 0,
      startDate: listing.startDate,
      endDate: listing.endDate,
      companyName:
        listing.companyName ??
        listing.company?.name ??
        `Company ${listing.companyId ?? "-"}`
    }));

  if (isLoading) {
    return <p>Loading tickets...</p>;
  }

  if (isError) {
    return <p>Could not load tickets.</p>;
  }

  if (tickets.length === 0) {
    return <p>No tickets available.</p>;
  }

  return (
    <ChooseTickets
      eventId={eventId}
      eventName={eventName}
      tickets={tickets}
    />
  );
}
