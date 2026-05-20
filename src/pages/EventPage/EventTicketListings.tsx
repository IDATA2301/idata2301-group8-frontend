import {
  useGetTicketListings,
  type TicketListingResponse
} from "@api/events";
import { useGetCompanies } from "@api/iam";
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
    isLoading: listingsLoading,
    isError: listingsError
  } = useGetTicketListings(
    { eventId },
    {
      query: {
        enabled: !!eventId
      }
    }
  );

  const {
    data: companiesResponse,
    isLoading: companiesLoading,
    isError: companiesError
  } = useGetCompanies();

  const listings =
    listingsResponse?.status === 200
      ? listingsResponse.data
      : [];

  const companies =
    companiesResponse?.status === 200
      ? companiesResponse.data
      : [];

  const getCompanyName = (listing: TicketListingWithCompany) => {
    const directCompanyName = listing.companyName ?? listing.company?.name;

    if (directCompanyName) {
      return directCompanyName;
    }

    return companies.find((company) => company.id === listing.companyId)?.name;
  };

  const tickets = listings
    .filter((listing: TicketListingResponse) => listing.ticketListingId != null)
    .map((listing: TicketListingWithCompany) => ({
      id: listing.ticketListingId!,
      name: listing.ticketType ?? "Ticket",
      price: listing.price ?? 0,
      startDate: listing.startDate,
      endDate: listing.endDate,
      companyName: getCompanyName(listing)
    }));

  if (listingsLoading || companiesLoading) {
    return <p>Loading tickets...</p>;
  }

  if (listingsError || companiesError) {
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
