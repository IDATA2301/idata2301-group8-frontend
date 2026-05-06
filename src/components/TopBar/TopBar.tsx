import { Link } from "react-router-dom";
import "./TopBar.css";
import { useRef } from "react";
import Dialog from "./Dialog";

type Props = {
  className?: string;
};

export default function TopBar({ className }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => dialogRef.current?.showModal();

  return (
    <header className={`TopBar ${className ?? ""}`}>
      <button className="menu">☰</button>

      <Link to="/" className="logo">NORDiSEAT</Link>

      <button className="register" onClick={openDialog}>Sign In / Register</button>
      <Dialog ref={dialogRef} />
    </header>
  );
}
