import {
  useGetTicketListings,
  type TicketListingResponse
} from "@api/events";
import ChooseTickets from "./ChooseTickets";
import toast from "@components/Toast";
import { useNavigate } from "react-router-dom";
import { useCreateOrder } from "@api/orders";

interface Props {
  eventId?: number;
}

export default function EventTicketListings({ eventId }: Props) {
  const navigate = useNavigate();
  const { mutateAsync: createOrder } = useCreateOrder()

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


  async function handleContinue(ticketCounts: Map<number, number>) {
    const items = [...ticketCounts.entries()]
      .filter(([, count]) => count > 0)
      .map(([ticketListingId, quantity]) => ({
        ticketListingId,
        quantity
      }));

    try {
      const response = await createOrder({ data: { items } })
      if (response.status >= 300 || response.status < 200) {
        toast.error("Could not reserve tickets. Please try again.");
      } else {
        toast.success("Tickets reserved! You can now proceed to checkout.");
        localStorage.setItem("checkoutData", JSON.stringify(response.data));
        navigate(`/payment/`);
      }
    } catch (error) {
      toast.error("Could not reserve tickets. Please try again.");
      return;
    }
  }

  return (
    <ChooseTickets
      tickets={tickets}
      handleContinue={handleContinue}
    />
  );
}
