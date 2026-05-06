import { useState } from "react";

import styles from "./AccountPage.module.css";

import TopBar from "@components/TopBar/TopBar";
import Footer from "@components/Footer/Footer";

import AccountTopbar from "./AccountTopbar";
import AccountInfo from "./AccountInfo";
import Favorites from "./Favorites";
import MyEvents from "./MyEvents";

export default function AccountPage() {

  const [selectedTab, setSelectedTab] = useState("account");

  const user = {
    username: "Marcus",
    email: "marcus@gmail.com",
    role: "EVENT_PROVIDER"
  };

  function renderContent() {

    if (selectedTab === "account") {
      return <AccountInfo user={user} />;
    }

    if (selectedTab === "favorites") {
      return <Favorites />;
    }

    if (
      selectedTab === "events"
      && user.role === "EVENT_PROVIDER"
    ) {
      return <MyEvents />;
    }

    return null;
  }

  return (
    <>

      <div className={styles.accountPage}>

        <h1>User Profile</h1>

        <AccountTopbar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          role={user.role}
        />

        <div className={styles.accountContent}>
          {renderContent()}
        </div>

      </div>

    </>
  );
}
