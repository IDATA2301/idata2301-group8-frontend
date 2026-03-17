import TopBar from "@components/TopBar/TopBar";
import heroimage from "@assets/footballfeatured.jpeg"
import "./style.css"
import EventPage from "./EventPage";

function EventPageLoader() {
  return <EventPage imgSrc={heroimage} />
}

export default EventPageLoader;
