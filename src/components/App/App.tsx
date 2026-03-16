import EventCard from '@components/EventCard/EventCard'
import { Link } from 'react-router-dom';
import ScrollToTop from "@utility/ScrollToTop";
import './Style.css'
import Footer from "@components/Footer/Footer";
import TopBar from "@components/TopBar/TopBar";
import heroimage from '@assets/heroimage.jpg'
import FeaturedEventCard from '@components/FeaturedEventCard/FeaturedEventCard';

function App() {

  return (
    <>
      <ScrollToTop />

      <div className="hero-image" style={{ backgroundImage: `url(${heroimage})` }}>

        <TopBar />

        <main>
          <h1>
            Your Gateway to <br />
            <span className="highlight">Unforgettable</span> Events
          </h1>
          <div className="search-container">
            <input placeholder="Search city, dates, events" type="text" className="search-bar" />
            <button className="search-button">Search</button>
          </div>
        </main>

      </div>

      <div className="page-container">
        <section>
          <h2>Categories</h2>

          <ul className="categories">
            <li>
              <Link className="category-card festivals" to="/category/festivals">
                Festivals
              </Link>
            </li>

            <li>
              <Link className="category-card concerts" to="/category/concerts">
                Concerts
              </Link>
            </li>

            <li>
              <Link className="category-card sport" to="/category/sport">
                Sport
              </Link>
            </li>

            <li>
              <Link className="category-card museums" to="/category/museums">
                Museums
              </Link>
            </li>

            <li>
              <Link className="category-card theaters" to="/category/theaters">
                Theaters
              </Link>
            </li>
          </ul>

        </section>


        <section>
          <h2>Featured</h2>
          <FeaturedEventCard />
          <hr />
        </section>


        <section>
          <h2>Upcoming</h2>
          <EventCard />
          <hr />
        </section>


      </div>


      <Footer />
    </>
  )
}

export default App
