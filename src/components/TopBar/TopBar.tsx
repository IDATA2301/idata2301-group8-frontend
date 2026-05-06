import { useState } from "react";

import { Link } from "react-router-dom";

import SideBar from "@components/SideBar/SideBar";

import "./TopBar.css";

type Props = {
  className?: string;
};

export default function TopBar({
  className
}: Props) {

  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
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

        <button className="register">
          Sign in / Register
        </button>

      </header>

      <SideBar
        isOpen={menuOpen}
        onClose={toggleMenu}
      />

    </>
  );
}
