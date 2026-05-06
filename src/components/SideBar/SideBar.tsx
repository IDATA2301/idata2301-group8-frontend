import { Link } from "react-router-dom";

import styles from "./SideBar.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SideBar({
  isOpen,
  onClose
}: Props) {

  return (
    <>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onClose}
        />
      )}

      <div
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

      </div>

    </>
  );
}
