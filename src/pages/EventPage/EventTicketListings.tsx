import {
  useGetTicketListings,
  type TicketListingResponse
} from "@api/events";
import ChooseTickets from "./ChooseTickets";

interface Props {
  eventId?: number;
  eventName: string;
}

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
    .map((listing: TicketListingResponse) => ({
      id: listing.ticketListingId!,
      name: listing.ticketType ?? "Ticket",
      price: listing.price ?? 0
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
