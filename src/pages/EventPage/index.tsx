import heroimage from "@assets/footballfeatured.jpeg"
import "./style.css"
import EventPage from "./EventPage";

function EventPageLoader() {
  return <EventPage
    imgSrc={heroimage}
    title="Rosenborg vs. Molde – Eliteserien Match"
    description="En sikkelig spennende kamp!"
    tags={["Sport", "Trondheim, Norway"]}
    tickets={[
      { id: 1, name: "Adult entry", price: 250.00 },
      { id: 2, name: "Child entry", price: 150.00 }
    ]}
    location={{
      name: "Trondheim Arena",
      address: "Grønnegata 83",
      city: "Tromsø",
      postalCode: "9008",
      iframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1844.0139163364038!2d6.232947477694636!3d62.472136476285996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4616dac1b03a4a8b%3A0x5df22844dd93ce98!2sNTNU%20i%20%C3%85lesund!5e0!3m2!1sen!2sno!4v1773831919802!5m2!1sen!2sno",
      openInMapsUrl: "https://maps.app.goo.gl/CHEexfJAuyUg9DHd6"
    }} />
}

export default EventPageLoader;
