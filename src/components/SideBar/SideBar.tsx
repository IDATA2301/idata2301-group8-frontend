import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@utility/AuthContext";
import { useGetAllCategories, useGetEvents } from "@api/events";
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
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const { data: categoriesResponse } = useGetAllCategories();

  const currentTime = useMemo(() => new Date().toISOString(), []);
  const { data: eventsResponse } = useGetEvents({
    startDate: currentTime,
    size: 1000
  });

  const categories = useMemo(() => {
    if (categoriesResponse?.status !== 200 || eventsResponse?.status !== 200) {
      return [];
    }

    const events = eventsResponse.data.content ?? [];
    const activeCategoryIds = new Set<number>();

    for (const event of events) {
      if (event.categoryIds) {
        for (const id of event.categoryIds) {
          activeCategoryIds.add(id);
        }
      }
    }

    return categoriesResponse.data
      .filter((c) => c.id !== undefined && activeCategoryIds.has(c.id))
      .filter((c) => c.name)
      .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
  }, [categoriesResponse, eventsResponse]);

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
          <button
            type="button"
            className={styles.categoryToggle}
            onClick={() => setCategoriesOpen((prev) => !prev)}
            aria-expanded={categoriesOpen}
          >
            <span>Categories</span>
            <span className={`${styles.chevron} ${categoriesOpen ? styles.chevronOpen : ""}`}>
              ›
            </span>
          </button>

          <div
            className={`${styles.categoryList} ${categoriesOpen ? styles.categoryListOpen : ""}`}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/search?category=${encodeURIComponent(category.name ?? "")}`}
                className={styles.categoryLink}
                onClick={onClose}
              >
                {category.name}
              </Link>
            ))}

            {categories.length === 0 && (
              <span className={styles.noCategories}>No categories available</span>
            )}
          </div>
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
