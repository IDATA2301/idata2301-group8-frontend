import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-top">

                    <Link to="/" className="footer-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        NORDiSEAT
                    </Link>

                    <div className="footer-columns">

                        <div className="footer-col">
                            <h4>Categories</h4>
                            <button>Festivals</button>
                            <button>Concert</button>
                            <button>Sport</button>
                            <button>Museums</button>
                            <button>Theaters</button>
                        </div>

                        <div className="footer-col">
                            <h4>Company</h4>
                            <Link to="/aboutUs">
                                <button>About us</button>
                            </Link>
                            <button>Press</button>
                            <button>News</button>
                            <button>Media kit</button>
                            <button>Contact</button>
                        </div>

                        <div className="footer-col">
                            <h4>Resources</h4>
                            <button>Blog</button>
                            <button>Newsletter</button>
                            <button>Help centre</button>
                            <button>Support</button>
                        </div>

                    </div>

                    <div className="footer-app">
                        <h4>Get the app</h4>
                        <button className="store-btn">App Store</button>
                        <button className="store-btn">Google Play</button>
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
