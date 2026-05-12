import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <Link
            to="/"
            className="footer-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            NORDiSEAT
          </Link>
          <div className="footer-columns">
            <div className="footer-col">
              <h4>Categories</h4>
              <Link to="/search?category=Festivals">Festivals</Link>
              <Link to="/search?category=Concerts">Concerts</Link>
              <Link to="/search?category=Sports">Sports</Link>
              <Link to="/search?category=Museums">Museums</Link>
              <Link to="/search?category=Theaters">Theaters</Link>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/aboutUs">About us</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <Link to="/help-centre">Help centre</Link>
              <Link to="/support">Support</Link>
            </div>
            <div className="footer-col">
              <h4>Other</h4>
              <Link to="/account">Account</Link>
              <Link to="/user-management">User management</Link>
              <Link to="/event-management">Event management</Link>
              <Link to="/request-management">Request management</Link>
            </div>
          </div>
          <div className="footer-app">
            <h4>Get the app</h4>
            <a href="#" className="store-btn">App Store</a>
            <a href="#" className="store-btn">Google Play</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Your gateway to unforgettable events</p>
          <p>© 2077 Nordiseat All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
