import { useMemo, useState } from "react";
import TicketCard, { type Ticket } from "./TicketCard.tsx";
import arrowRight from "@assets/icons/arrow-right.svg";

type Props = {
  tickets: Ticket[];
};

function ChooseTickets({ tickets }: Props) {
  const ticketPriceMap = useMemo(() => {
    return new Map(tickets.map((ticket) => [ticket.id, ticket.price]));
  }, [tickets]);

  const [ticketCounts, setTicketCounts] = useState<Map<number, number>>(new Map());

  const totalTicketCount = [...ticketCounts.values()].reduce(
    (sum, count) => sum + count,
    0
  );

  const totalTicketPrice = [...ticketCounts.entries()].reduce(
    (sum, [ticketId, count]) => {
      const ticketPrice = ticketPriceMap.get(ticketId) ?? 0;

      return sum + ticketPrice * count;
    },
    0
  );

  const createHandler = (ticketId: number) => (count: number) => {
    setTicketCounts((currentMap) => {
      const newMap = new Map(currentMap);

      if (count <= 0) {
        newMap.delete(ticketId);
        return newMap;
      }

      newMap.set(ticketId, count);
      return newMap;
    });
  };

  return (
    <div className="choose-tickets-box">
      <h2 className="choose-tickets-title">
        Velg billetter
      </h2>

      <div className="ticket-card-container">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onChange={createHandler(ticket.id)}
          />
        ))}
      </div>

      <div className="ticket-card-bottom-box">
        <div className="ticket-card-bottom-info-box">
          <p className="ticket-card-bottom-label">
            You have added
          </p>

          <p className="ticket-card-bottom-summary">
            {totalTicketCount} tickets · {totalTicketPrice.toFixed(2)} NOK
          </p>
        </div>

        <button
          className="ticket-card-action-button"
          disabled={totalTicketCount === 0}
        >
          Continue

          <img
            className="ticket-card-icon"
            src={arrowRight}
            alt="continue icon"
          />
        </button>
      </div>
    </div>
  );
}

export default ChooseTickets;
