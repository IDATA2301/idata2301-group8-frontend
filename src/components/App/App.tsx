import EventCard from '@components/EventCard/EventCard'
import './style.css'
import Footer from "../footer/Footer";

function App() {

  return (
    <>
      <header>
        <button><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 14.5V13H17V14.5H3ZM3 10.75V9.25H17V10.75H3ZM3 7V5.5H17V7H3Z" fill="#000000" />
        </svg></button>
        <a href="/" id="main-logo">NORDiSEAT</a>
        <a href="/login" id="sign-up">Sign up / Register</a>
      </header>

      <main>
        <h1><a href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"></a>Your Gateway to Unforgettable Events</h1>

        <div className="search-container">
          <input placeholder="Search city, dates, events" type="text" className="search-bar" />
          <button className="search-button">Search</button>
        </div>

      </main>

      <section>

        <h2>Categories</h2>
        <ul className="categories">
          <li><a href="/category/festivals">Festivals</a></li>
          <li><a href="/category/concerts">Concerts</a></li>
          <li><a href="/category/sport">Sport</a></li>
          <li><a href="/category/museums">Museums</a></li>
          <li><a href="/category/theaters">Theaters</a></li>
        </ul>

      </section>


      <section>
        <h2>Featured</h2>
        <EventCard title="Fotball" location="Spain" price={42} imageSource="" href="" />
        <hr />
      </section>

      <section>
        <h2>Favorites</h2>
        <hr />
      </section>

      <section>
        <h2>Upcoming</h2>
        <hr />
      </section>

      <Footer />
    </>
  )
}

export default App
