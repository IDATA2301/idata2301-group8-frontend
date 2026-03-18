import { Link } from "react-router-dom";
import "./TopBar.css";

type Props = {
  className?: string;
};

export default function TopBar({ className }: Props) {
  return (
    <header className={`TopBar ${className ?? ""}`}>
      <div className="menu">☰</div>

      <Link to="/" className="logo">NORDiSEAT</Link>

      <div className="register">Sign in / Register</div>
    </header>
  );
}
