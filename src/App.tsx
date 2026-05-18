import { Routes, Route, useLocation } from "react-router-dom";
import TopBar from "@components/TopBar/TopBar";
import Footer from "@components/Footer/Footer";
import { Toaster } from "@components/Toast";
import SearchPage from "@pages/SearchPage/SearchPage";
import HomePage from "@pages/HomePage/HomePage";
import EventPageLoader from "@pages/EventPage";
import AboutUsPage from "@pages/AboutUsPage/AboutUsPage";
import AccountPage from "@pages/AccountPage/AccountPage";
import UserManagement from "@pages/UserManagement/UserManagement";
import RequestManagement from "@pages/RequestManagement/RequestManagement";
import EventManagement from "@pages/EventManagement/EventManagement";
import ScrollToTop from "@utility/ScrollToTop";

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
        <Route path="/events/:eventslug" element={<EventPageLoader />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/aboutUs" element={<AboutUsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/event-management" element={<EventManagement />} />
        <Route path="/request-management" element={<RequestManagement />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
