import styles from "./AccountPage.module.css";

import AccountInfo from "./AccountInfo";
import Favorites from "./Favorites";
import MyEvents from "./MyEvents";
import CompanySection from "./CompanySection";
import { Tabs } from "@components/Tabs/Tabs";
import { useAuthContext, type CompanyRole, type GlobalRole } from "@utility/AuthContext";
import { useGetCompanies } from "@api/iam";
import StateBanner from "@components/StateBanner/StateBanner";

export default function AccountPage() {
  const { user, isLoggedIn, isAdmin, isProvider } = useAuthContext()
  const { data: companiesResponse, isSuccess: companiesSuccess } = useGetCompanies();

  if (!isLoggedIn) {
    return <StateBanner
      title="Not logged in"
      description="You must be logged in to view your account page."
    />;
  }

  const username = user.email.split("@")[0] || "Guest";

  function formatRole(role: string) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  function formatRoles(globalRoles: GlobalRole[], companyRoles: Record<string, CompanyRole[]>): string {
    const roleParts: string[] = [];
    globalRoles.filter(role => role !== "USER").forEach(role => {
      roleParts.push(`${formatRole(role)} on the Platform`)
    });
    if (companiesSuccess) {
      Object.entries(companyRoles).forEach(([companyId, roles]) => {
        roles.forEach(role => {
          const companyName = companiesResponse.data.find((company) => company.id === parseInt(companyId))?.name
          if (companyName) {
            roleParts.push(`${formatRole(role)} at ${companyName}`);
          }
        });
      });
    }
    return roleParts.join(" | ");
  }

  return (
    <div className={styles.accountPage}>

      <div className={styles.profileHeader}>

        <div className={styles.profileAvatar}>
          {username.charAt(0).toUpperCase()}
        </div>

        <div className={styles.profileInfo}>

          <h1 className={styles.pageTitle}>
            {username}
          </h1>

          {(isAdmin || isProvider) && (
            <p className={styles.profileRole}>
              {formatRoles(user.globalRoles, user.companyRoles)}
            </p>
          )}

        </div>

      </div>

      <Tabs
        defaultActiveId="user-info"
        tabPanelClassName={styles.accountContent}
        items={[
          {
            id: "events",
            label: "My Events",
            content: <MyEvents />
          },
          {
            id: "user-info",
            label: "User Information",
            content: (
              <div className={styles.accountLayout}>
                <AccountInfo />

                {(isProvider && companiesSuccess) && (
                  <div className={styles.providerCompaniesSection}>
                    <h2 className={styles.providerCompaniesTitle}>
                      Companies
                    </h2>

                    {Object.entries(user.companyRoles).map(([companyId, _]) => {
                      const company = companiesResponse.data.find((company) => company.id === parseInt(companyId));
                      if (!company) return null;
                      return (
                        <CompanySection
                          key={companyId}
                          company={company}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )
          },
          {
            id: "favorites",
            label: "Favorites",
            content: <Favorites />
          }
        ]}
      />
    </div>
  );
}
