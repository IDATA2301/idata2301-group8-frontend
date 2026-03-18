import { useState } from 'react';
import TicketCard, { type Ticket } from './TicketCard.tsx'
import arrowRight from "@assets/icons/arrow-right.svg"

type Props = {
  tickets: Ticket[],
}

function ChooseTickets({ tickets }: Props) {
  const ticketMap = new Map<number, number>();
  tickets.forEach(t => ticketMap.set(t.id, t.price));

  const [ticketCounts, setTicketCounts] = useState<Map<number, number>>(new Map());
  const totalTicketCount = [...ticketCounts.values()].reduce((accumulator, value) => accumulator + value, 0)
  const totalTicketPrice = [...ticketCounts.entries()].reduce((accumulator, entry) => accumulator + (ticketMap.get(entry[0])! * entry[1]), 0)

  const createHandler = (id: number) => (count: number) => {
    setTicketCounts(currentMap => {
      const newMap = new Map(currentMap);
      newMap.set(id, count);
      return newMap;
    });
  };

  return (
    <div className='choose-tickets-box'>
      <h2 className='choose-tickets-title'>Velg billeter</h2>
      <div className='ticket-card-container'>
        {tickets.map(t => (
          <TicketCard key={t.id} onChange={createHandler(t.id)} ticket={t} />
        ))}
      </div>
      <div className='ticket-card-bottom-box'>
        <div className='ticket-card-bottom-info-box'>
          <p className='ticket-card-bottom-label'>You have added</p>
          <p className='ticket-card-bottom-summary'>{totalTicketCount} tickets · {totalTicketPrice} NOK</p>
        </div>
        <button className='ticket-card-action-button'>Continue <img className="ticket-card-icon" src={arrowRight} alt="decrement icon" />
        </button>
      </div>
    </div>
  )
}

export default ChooseTickets
