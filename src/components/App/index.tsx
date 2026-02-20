import './index.css'
import EventCard from '@components/EventCard'

function App() {

  return (
    <>
      <header>
        <a href="/" id="main-logo">NORDiSEAT</a>
        <a href="/login" id="sign-up">Sign up / Register</a>
      </header>

      <main>
        <ul>
          <li><a href="/category/festivals">Festivals</a></li>
          <li><a href="/category/concerts">Concerts</a></li>
          <li><a href="/category/sport">Sport</a></li>
          <li><a href="/category/museums">Museums</a></li>
          <li><a href="/category/theaters">Theaters</a></li>
        </ul>

        <div>
          <button>Dates</button>
          <input />
          <button>Search</button>
        </div>

        <button>All Categories</button>
      </main>

      <section>
        <h1>Favorites</h1>
        <EventCard title="Fotball" location="Spain" price={42} imageSource="" href="" />
        <hr />

      </section>

      <section>
        <h1>Last visited</h1>
        <hr />
      </section>

      <section>
        <h1>Featured</h1>
        <hr />
      </section>

      <section>
        <h1>Upcoming</h1>
        <hr />
      </section>

      <footer>
        <p>efjieei</p>
      </footer>
    </>
  )
}

export default App
