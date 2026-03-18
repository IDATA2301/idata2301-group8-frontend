import { Link } from "react-router-dom";
import "./TopBar.css";

type Props = {
  className?: string;
};

export default function TopBar({ className }: Props) {
  return (
    <header className={`TopBar ${className ?? ""}`}>
      <button className="menu">☰</button>

      <Link to="/" className="logo">NORDiSEAT</Link>

      <button className="register">Sign in / Register</button>
    </header>
  );
}
