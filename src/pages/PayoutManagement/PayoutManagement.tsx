import { useGetCompanies } from "@api/iam";
import styles from "../EventManagement/EventManagement.module.css";

export default function PayoutManagement() {
  const companiesQuery = useGetCompanies();
  const companiesData = companiesQuery.data?.data;
  const companies = Array.isArray(companiesData) ? companiesData : [];

  const payoutRows = companies.map((company) => [
    company.id ?? "-",
    company.name ?? "-",
    company.payoutAccount ?? "Not set",
    "Pending"
  ]);

  return (
    <main className={styles.eventManagementPage}>
      <div className={styles.pageContent}>
        <header className={styles.pageHeader}>
          <div>
            <h1>Payout management</h1>
          </div>
        </header>

        <div className={styles.sectionsGrid}>
          <section className={styles.managementSection}>
            <div className={styles.sectionHeader}>
              <h2>Company payouts</h2>
            </div>

            <div className={styles.managementBox}>
              <div
                className={styles.tableHeader}
                style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
              >
                <span>company_id</span>
                <span>company_name</span>
                <span>payout_account</span>
                <span>status</span>
              </div>

              <div className={styles.entriesList}>
                {payoutRows.length > 0 ? (
                  payoutRows.map((entry, index) => (
                    <div
                      key={index}
                      className={styles.eventManagementEntry}
                      style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
                    >
                      {entry.map((value, valueIndex) => (
                        <span key={valueIndex} title={String(value)}>
                          {value}
                        </span>
                      ))}
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyMessage}>No companies found.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
