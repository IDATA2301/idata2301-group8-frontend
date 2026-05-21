import {
  useGetTicketListings,
  type TicketListingResponse
} from "@api/events";
import { useCreateOrder } from "@api/orders";
import { useGetCompanies } from "@api/iam";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@utility/AuthContext";
import ChooseTickets from "./ChooseTickets";
import toast from "@components/Toast";

interface Props {
  eventId?: number;
}

type TicketListingWithCompany = TicketListingResponse & {
  companyName?: string | null;
  company?: {
    name?: string | null;
  } | null;
};

export default function EventTicketListings({ eventId }: Props) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();
  const { mutateAsync: createOrder } = useCreateOrder();

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

  async function handleContinue(ticketCounts: Map<number, number>) {
    const items = [...ticketCounts.entries()]
      .filter(([, count]) => count > 0)
      .map(([ticketListingId, quantity]) => ({
        ticketListingId,
        quantity
      }));

    try {
      const response = await createOrder({ data: { items } });

      if (response.status >= 300 || response.status < 200) {
        toast.error("Could not reserve tickets. Please try again.");
      } else {
        toast.success("Tickets reserved! You can now proceed to checkout.");
        localStorage.setItem("checkoutData", JSON.stringify(response.data));
        navigate("/payment/");
      }
    } catch (error) {
      toast.error("Could not reserve tickets. Please try again.");
    }
  }

  return (
    <ChooseTickets
      tickets={tickets}
      handleContinue={handleContinue}
      isLoggedIn={isLoggedIn}
    />
  );
}
