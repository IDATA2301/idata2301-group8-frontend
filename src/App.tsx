import { Routes, Route } from 'react-router-dom'

import TopBar from '@components/TopBar/TopBar'
import Footer from '@components/Footer/Footer'

import { Toaster } from '@components/Toast';

import SearchPage from '@pages/SearchPage/SearchPage'
import HomePage from '@pages/HomePage/HomePage'
import EventPageLoader from '@pages/EventPage'
import AboutUsPage from '@pages/AboutUsPage/AboutUsPage';
import AccountPage from '@pages/AccountPage/AccountPage';

import ScrollToTop from '@utility/ScrollToTop';

import { useLocation } from "react-router-dom";

function App() {

  const location = useLocation();

  const isHeroPage =
    location.pathname === "/" ||
    location.pathname.startsWith("/events/");

  return (
    <>

      <Toaster />

      <TopBar className={isHeroPage ? "topbar-overlay" : ""} />

      <ScrollToTop />

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route
          path="/events/:eventslug"
          element={<EventPageLoader />}
        />

        <Route
          path="/search"
          element={<SearchPage />}
        />

        <Route
          path="/aboutUs"
          element={<AboutUsPage />}
        />

        <Route
          path="/account"
          element={<AccountPage />}
        />

      </Routes>

      <Footer />

    </>
  );
}

export default App
