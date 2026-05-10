import ScrollToTop from "@utility/ScrollToTop"
import { Link } from "react-router-dom"
import styles from "./StateBanner.module.css"

type Props = {
  title?: string;
  description?: string;
  showBackLink?: boolean;
}

function StateBanner({ title, description, showBackLink = true }: Props) {
  return (
    <>
      <ScrollToTop />
      <main className={styles.stateBanner}>
        <div className={styles.stateBannerCard}>
          {title && <h1>{title}</h1>}
          {description && <p>{description}</p>}
          {showBackLink && (
            <Link to="/" className={styles.stateBannerLink}>
              Back to homepage
            </Link>
          )}
        </div>
      </main>
    </>
  )
}

export default StateBanner
