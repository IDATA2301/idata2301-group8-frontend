import { useState } from "react";
import { jwtDecode } from "jwt-decode";

import styles from "./AccountPage.module.css";

import AccountTopbar from "./AccountTopbar";
import AccountInfo from "./AccountInfo";
import Favorites from "./Favorites";
import MyEvents from "./MyEvents";
import CompanySection from "./CompanySection";

interface JwtPayload {
  email?: string;
  role?: string;
  providerCompany?: string;

  providerCompanies?: {
    id: number;
    companyName: string;
    pending?: boolean;
    websiteUrl?: string;
    payoutAccount?: string;
  }[];

  userCompanies?: {
    companyId: number;
    pending?: boolean;
  }[];
}

export default function AccountPage() {
  const [selectedTab, setSelectedTab] = useState("account");

  const token = localStorage.getItem("token");

  const decoded = token
    ? jwtDecode<JwtPayload>(token)
    : null;

  const user = {
    username: decoded?.email?.split("@")[0] || "Guest",
    email: decoded?.email || "MyEmail@gmail.com",
    role: decoded?.role || "NORMAL_USER",
    providerCompany: decoded?.providerCompany || "",
    providerCompanies: decoded?.providerCompanies || [],
    userCompanies: decoded?.userCompanies || []
  };

  function formatRole(role: string) {
    return role
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function renderContent() {

    if (selectedTab === "favorites") {
      return <Favorites />;
    }

    if (selectedTab === "events") {
      return <MyEvents />;
    }

    const hasCompanies =
      user.providerCompanies.length > 0;

    return (
      <div className={styles.accountLayout}>

        <AccountInfo user={user} hasCompanies={hasCompanies} />

        {hasCompanies && (
          <div className={styles.providerCompaniesSection}>

            <h2 className={styles.providerCompaniesTitle}>
              Companies
            </h2>

            {user.providerCompanies.map((company) => (
              <CompanySection
                key={company.id}
                companyName={company.companyName}
                websiteUrl={company.websiteUrl}
                payoutAccount={company.payoutAccount}
                pending={company.pending}
              />
            ))}

          </div>
        )}

      </div>
    );
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

          {user.role !== "NORMAL_USER" && (
            <p className={styles.profileRole}>
              {formatRole(user.role)}
            </p>
          )}

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
