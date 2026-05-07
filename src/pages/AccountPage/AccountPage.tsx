import { useState } from "react";

import { jwtDecode } from "jwt-decode";

import styles from "./AccountPage.module.css";

import AccountTopbar from "./AccountTopbar";

import AccountInfo from "./AccountInfo";
import Favorites from "./Favorites";
import MyEvents from "./MyEvents";

interface JwtPayload {

  email?: string;

  role?: string;

  availableRoles?: string[];

  providerCompany?: string;

  providerCompanies?: {

    id: number;
    companyName: string;

  }[];

}

export default function AccountPage() {

  const [selectedTab, setSelectedTab] =
    useState("account");

  const token =
    localStorage.getItem("token");

  const decoded =
    token
      ? jwtDecode<JwtPayload>(token)
      : null;

  const user = {

    username:
      decoded?.email?.split("@")[0]
      || "Guest",

    email:
      decoded?.email
      || "MyEmail@gmail.com",

    role:
      decoded?.role
      || "NORMAL_USER",

    availableRoles:
      decoded?.availableRoles
      || ["NORMAL_USER"],

    providerCompany:
      decoded?.providerCompany
      || "",

    providerCompanies:
      decoded?.providerCompanies
      || []

  };

  function formatRole(role: string) {

    return role
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

  }

  function renderContent() {

    if (selectedTab === "account") {

      return (
        <AccountInfo user={user} />
      );

    }

    if (selectedTab === "favorites") {

      return <Favorites />;

    }

    if (selectedTab === "events") {

      return <MyEvents />;

    }

    return null;
  }

  return (

    <div className={styles.accountPage}>

      {!token && (

        <div className={styles.loginWarning}>

          Not logged in

        </div>

      )}

      <div className={styles.profileHeader}>

        <div className={styles.profileAvatar}>

          {user.username.charAt(0)}

        </div>

        <div className={styles.profileInfo}>

          <h1 className={styles.pageTitle}>
            {user.username}
          </h1>

          <p className={styles.profileRole}>

            {formatRole(user.role)}

          </p>

        </div>

      </div>

      <AccountTopbar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      <div className={styles.accountContent}>

        {renderContent()}

      </div>

    </div>

  );
}
