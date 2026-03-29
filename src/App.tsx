import { Routes, Route } from 'react-router-dom'
import TopBar from '@components/TopBar/TopBar'
import Footer from '@components/Footer/Footer'
import SearchPage from '@pages/SearchPage/SearchPage'
import { useLocation } from "react-router-dom";
import HomePage from '@pages/HomePage/HomePage'
import EventPageLoader from '@pages/EventPage'
import ScrollToTop from '@utility/ScrollToTop';


function App() {
  const location = useLocation();

  const isHeroPage =
    location.pathname === "/" ||
    location.pathname.startsWith("/events/");

  return (
    <>
      <TopBar className={isHeroPage ? "topbar-overlay" : ""} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:eventslug" element={<EventPageLoader />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App
