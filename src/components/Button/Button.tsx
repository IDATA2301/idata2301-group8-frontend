import type { ReactNode } from "react";
import styles from "./Button.module.css";

type Props = {
  onClick?: () => void;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "button" | "buttonWithIcon"
};

export default function Button({ onClick, children, type, variant = "button", disabled }: Props) {
  return (
    <button onClick={onClick} className={styles[variant]} type={type} disabled={disabled}>
      {children}
    </button>
  );
}
