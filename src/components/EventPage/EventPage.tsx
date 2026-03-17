import TopBar from "@components/TopBar/TopBar";
import "./style.css"
import Footer from "@components/Footer/Footer";

type Props = {
  imgSrc: string,
}

function EventPage(p: Props) {
  return (
    <>
      <div className="hero-image" style={{ backgroundImage: `url(${p.imgSrc})` }}>
        <div className="top-bar-transition-overlay">
          <TopBar />
        </div>
      </div>
      <div>

      </div>
      <Footer />
    </>
  )
}

export default EventPage;
