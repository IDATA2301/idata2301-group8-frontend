import { useState } from "react";
import plus from "@assets/icons/plus.svg";
import minus from "@assets/icons/minus.svg";
import Button from "@components/Button/Button";

export type Ticket = {
  id: number;
  name: string;
  price: number;
};

type Props = {
  ticket: Ticket;
  onChange: (num: number) => void;
};

function TicketCard({ onChange, ticket }: Props) {
  const maxCount = 99;
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((currentCount) => {
      const nextCount = Math.min(currentCount + 1, maxCount);
      onChange(nextCount);
      return nextCount;
    });
  };

  const decrement = () => {
    setCount((currentCount) => {
      const nextCount = Math.max(currentCount - 1, 0);
      onChange(nextCount);
      return nextCount;
    });
  };

  return (
    <div className="ticket-card-box">
      <div className="ticket-card-left">
        <p className="ticket-card-name">
          {ticket.name}
        </p>
        <p className="ticket-card-price">
          {ticket.price} NOK
        </p>
      </div>
      <div className="ticket-card-right">
        {count > 0 && (
          <>
            <button
              type="button"
              className="ticket-card-button"
              onClick={decrement}
              aria-label={`Decrease ${ticket.name} quantity`}
            >
              <img
                className="ticket-card-icon"
                src={minus}
                alt=""
                aria-hidden="true"
              />
            </button>
            <p className="ticket-card-count" aria-live="polite">
              {count}
            </p>
          </>
        )}
        <Button
          onClick={increment}
          variant="buttonWithIcon"
          disabled={count >= maxCount}
          aria-label={`Increase ${ticket.name} quantity`}
        >
          <img
            className="ticket-card-icon"
            src={plus}
            alt=""
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}

export default TicketCard;
