import plus from "@assets/icons/plus.svg"
import minus from "@assets/icons/minus.svg"
import { useEffect, useState } from "react"

export type Ticket = {
  id: number,
  name: string,
  price: number
}

type Props = {
  ticket: Ticket,
  onChange: (num: number) => void,
}

function TicketCard({ onChange, ticket }: Props) {
  const maxCount = 99;

  const [count, setCount] = useState(0);

  useEffect(() => {
    onChange(count)
  }, [count])

  const increment = () => {
    setCount(count => count + 1)
  }
  const decrement = () => {
    setCount(count => count - 1)
  }

  return (
    <div className="ticket-card-box">
      <div className="ticket-card-left">
        <p className="ticket-card-name">{ticket.name}</p>
        <p className="ticket-card-price">{ticket.price} NOK</p>
      </div>
      <div className="ticket-card-right">
        {count > 0 && (
          <>
            <button className="ticket-card-button" onClick={decrement}>
              <img className="ticket-card-icon" src={minus} alt="decrement icon" />
            </button>
            <p className="ticket-card-count">{count}</p>
          </>
        )}
        <button className="ticket-card-button" onClick={increment} disabled={count >= maxCount}>
          <img className="ticket-card-icon" src={plus} alt="increment icon" />
        </button>
      </div>
    </div>
  )
}

export default TicketCard;
