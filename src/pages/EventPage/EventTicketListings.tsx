import {
  useGetListingsByEvent,
  type TicketListingResponse
} from "@api/events";
import ChooseTickets from "./ChooseTickets";

interface Props {
  eventId?: number;
}

export default function EventTicketListings({ eventId }: Props) {
  const {
    data: listingsResponse,
    isLoading,
    isError
  } = useGetListingsByEvent(eventId ?? 0, {
    query: {
      enabled: !!eventId
    }
  });

  const listings =
    listingsResponse?.status !== 200
      ? []
      : listingsResponse.data;

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

  return <ChooseTickets tickets={tickets} />;
}
