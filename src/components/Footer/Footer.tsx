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
              <Link to="/category/festivals">Festivals</Link>
              <Link to="/category/concerts">Concert</Link>
              <Link to="/category/sport">Sport</Link>
              <Link to="/category/museums">Museums</Link>
              <Link to="/category/theaters">Theaters</Link>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/aboutUs">About us</Link>
              <Link to="/press">Press</Link>
              <Link to="/news">News</Link>
              <Link to="/media-kit">Media kit</Link>
              <Link to="/contact">Contact</Link>
            </div>

            <div className="footer-col">
              <h4>Resources</h4>
              <Link to="/blog">Blog</Link>
              <Link to="/newsletter">Newsletter</Link>
              <Link to="/help-centre">Help centre</Link>
              <Link to="/support">Support</Link>
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
