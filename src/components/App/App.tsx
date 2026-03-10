import EventCard from '@components/EventCard/EventCard'
import './style.css'
import Footer from "../Footer/Footer";
import Header from "../Header/Header.tsx";
function App() {

  return (
    <>
      <div className="hero-image">

        <Header />

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

      <section>
        <h2>Categories</h2>

        <ul className="categories">
          <li>
            <a className="category-card festivals" href="/category/festivals">
              Festivals
            </a>
          </li>

          <li>
            <a className="category-card concerts" href="/category/concerts">
              Concerts
            </a>
          </li>

          <li>
            <a className="category-card sport" href="/category/sport">
              Sport
            </a>
          </li>

          <li>
            <a className="category-card museums" href="/category/museums">
              Museums
            </a>
          </li>

          <li>
            <a className="category-card theaters" href="/category/theaters">
              Theaters
            </a>
          </li>
        </ul>
        <hr />

      </section>


      <section>
        <h2>Featured</h2>
        <EventCard />
        <hr />
      </section>


      <section>
        <h2>Upcoming</h2>
        <EventCard />
        <hr />
      </section>

      <Footer />
    </>
  )
}

export default App
