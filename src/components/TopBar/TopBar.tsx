import { Link } from "react-router-dom";
import "./TopBar.css";
import { useRef } from "react";
import Dialog from "./Dialog";
import { useAuthContext } from "@utility/AuthContext";
import AccountSvg from "@assets/icons/account.svg";

type Props = {
  className?: string;
};

export default function TopBar({ className }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { isLoggedIn } = useAuthContext();
  const openDialog = () => dialogRef.current?.showModal();

  return (
    <header className={`TopBar ${className ?? ""}`}>
      <button className="menu">☰</button>

      <Link to="/" className="logo">NORDiSEAT</Link>

      {isLoggedIn
        ? <img src={AccountSvg} alt="account icon" />
        : <button className="register" onClick={openDialog}>Log in / Sign up</button>}

      <Dialog ref={dialogRef} />
    </header>
  );
}
