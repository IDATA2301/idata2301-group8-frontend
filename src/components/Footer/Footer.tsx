import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-columns">

          <div>
            <h4>Categories</h4>
            <p>Festivals</p>
            <p>Concerts</p>
            <p>Sport</p>
            <p>Museums</p>
            <p>Theaters</p>
          </div>

          <div>
            <h4>Other</h4>
            <p>Sign in / Register</p>
          </div>

        </div>

        <div className="footer-logo">
          NORDiSEAT
        </div>

      </div>
    </footer>
  );
}
