import { useEffect, useState } from "react";
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

  useEffect(() => {
    onChange(count);
  }, [count, onChange]);

  const increment = () => {
    setCount((prev) => Math.min(prev + 1, maxCount));
  };

  const decrement = () => {
    setCount((prev) => Math.max(prev - 1, 0));
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
              className="ticket-card-button"
              onClick={decrement}
            >
              <img
                className="ticket-card-icon"
                src={minus}
                alt="decrement icon"
              />
            </button>

            <p className="ticket-card-count">
              {count}
            </p>
          </>
        )}

        <Button
          onClick={increment}
          variant="buttonWithIcon"
          disabled={count >= maxCount}
        >
          <img
            className="ticket-card-icon"
            src={plus}
            alt="increment icon"
          />
        </Button>
      </div>
    </div>
  );
}

export default TicketCard;
