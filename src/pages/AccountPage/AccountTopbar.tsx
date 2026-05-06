import styles from "./AccountPage.module.css";

interface Props {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  role: string;
}

export default function AccountTopbar({
  selectedTab,
  setSelectedTab,
  role
}: Props) {

  return (
    <div className={styles.accountTopbar}>

      <button
        className={
          selectedTab === "account"
            ? `${styles.tabButton} ${styles.activeTab}`
            : styles.tabButton
        }
        onClick={() => setSelectedTab("account")}
      >
        Account
      </button>

      <button
        className={
          selectedTab === "favorites"
            ? `${styles.tabButton} ${styles.activeTab}`
            : styles.tabButton
        }
        onClick={() => setSelectedTab("favorites")}
      >
        Favorites
      </button>

      {role === "EVENT_PROVIDER" && (
        <button
          className={
            selectedTab === "events"
              ? `${styles.tabButton} ${styles.activeTab}`
              : styles.tabButton
          }
          onClick={() => setSelectedTab("events")}
        >
          My Events
        </button>
      )}

    </div>
  );
}
