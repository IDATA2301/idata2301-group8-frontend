import { Link } from "react-router-dom";
import "./TopBar.css";

export default function TopBar() {
  return (
    <header className="TopBar">

      <div className="menu">☰</div>

      <Link to="/" className="logo">NORDiSEAT</Link>

      <div className="register">Sign in / Register</div>

    </header>
  );
}
