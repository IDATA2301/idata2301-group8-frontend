import { Link } from "react-router-dom";
import { useAuthContext } from "@utility/AuthContext";
import styles from "./SideBar.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SideBar({
  isOpen,
  onClose
}: Props) {
  const auth = useAuthContext();
  const isAdmin = auth.isLoggedIn && auth.isAdmin;
  const isProvider = auth.isLoggedIn && auth.isProvider;

  return (
    <>
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onClose}
        />
      )}

      <aside
        className={
          isOpen
            ? `${styles.sideMenu} ${styles.open}`
            : styles.sideMenu
        }
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className={styles.title}>
          Navigation
        </h2>

        <Link
          to="/account"
          className={styles.menuLink}
          onClick={onClose}
        >
          My Account
        </Link>

        <div className={styles.categorySection}>
          <h4 className={styles.categoryTitle}>
            Categories
          </h4>

          <Link
            to="/search?category=Festivals"
            className={styles.categoryLink}
            onClick={onClose}
          >
            Festivals
          </Link>

          <Link
            to="/search?category=Concerts"
            className={styles.categoryLink}
            onClick={onClose}
          >
            Concerts
          </Link>

          <Link
            to="/search?category=Sports"
            className={styles.categoryLink}
            onClick={onClose}
          >
            Sports
          </Link>

          <Link
            to="/search?category=Museums"
            className={styles.categoryLink}
            onClick={onClose}
          >
            Museums
          </Link>

          <Link
            to="/search?category=Theaters"
            className={styles.categoryLink}
            onClick={onClose}
          >
            Theaters
          </Link>
        </div>

        {(isAdmin || isProvider) && (
          <Link
            to="/event-management"
            className={styles.menuLink}
            onClick={onClose}
          >
            Event management
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/user-management"
            className={styles.menuLink}
            onClick={onClose}
          >
            User management
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/request-management"
            className={styles.menuLink}
            onClick={onClose}
          >
            Request management
          </Link>
        )}
      </aside>
    </>
  );
}
