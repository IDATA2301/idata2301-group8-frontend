import { useState, useRef } from "react";

import { Link } from "react-router-dom";

import SideBar from "@components/SideBar/SideBar";

import "./TopBar.css";

import Dialog from "./Dialog";

import { useAuthContext } from "@utility/AuthContext";

import AccountSvg from "@assets/icons/account.svg";

type Props = {
  className?: string;
};

export default function TopBar({
  className
}: Props) {

  const [menuOpen, setMenuOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const { isLoggedIn } = useAuthContext();

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function openDialog() {
    dialogRef.current?.showModal();
  }

  return (
    <>

      <header className={`TopBar ${className ?? ""}`}>

        <button
          className="menu"
          onClick={toggleMenu}
        >
          ☰
        </button>

        <Link
          to="/"
          className="logo"
        >
          NORDiSEAT
        </Link>

        {isLoggedIn
          ? (
            <Link to="/account">

              <img
                src={AccountSvg}
                alt="account icon"
                className="accountIcon"
              />

            </Link>
          )
          : (
            <button
              className="register"
              onClick={openDialog}
            >
              Log in / Sign up
            </button>
          )}

      </header>

      <Dialog ref={dialogRef} />

      <SideBar
        isOpen={menuOpen}
        onClose={toggleMenu}
      />

    </>
  );
}
