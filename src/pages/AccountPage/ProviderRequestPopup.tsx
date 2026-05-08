import { useState } from "react";

import styles from "./AccountPage.module.css";

interface ProviderCompany {

  id: number;

  companyName: string;

}

interface Props {

  providerCompanies: ProviderCompany[];

  onCancel: () => void;

  onConfirm: () => void;

}

export default function ProviderRequestPopup({
  providerCompanies,
  onCancel,
  onConfirm
}: Props) {

  const [
    requestType,
    setRequestType
  ] = useState<
    "EXISTING" | "NEW"
  >("EXISTING");

  const [
    selectedCompany,
    setSelectedCompany
  ] = useState("");

  const [
    companyName,
    setCompanyName
  ] = useState("");

  const [
    websiteUrl,
    setWebsiteUrl
  ] = useState("");

  const [
    payoutAccount,
    setPayoutAccount
  ] = useState("");

  function handleRequest() {

    const providerRequest = {

      requestType,

      existingCompany:
        requestType === "EXISTING"
          ? selectedCompany
          : null,

      newCompany:
        requestType === "NEW"
          ? {

            companyName,

            websiteUrl,

            payoutAccount

          }
          : null

    };

    console.log(providerRequest);

    onConfirm();

  }

  return (

    <div className={styles.popupOverlay}>

      <div className={styles.popupBox}>

        <h3>Become a Ticket Provider</h3>

        <p>

          Send a request to the global admin
          to become a ticket provider.

        </p>

        <div className={styles.popupForm}>

          <div className={styles.requestTypeSelector}>

            <button
              type="button"
              className={`${styles.requestTypeButton} ${requestType === "EXISTING"
                ? styles.activeRequestType
                : ""
                }`}
              onClick={() =>
                setRequestType("EXISTING")
              }
            >

              Join Existing Company

            </button>

            <button
              type="button"
              className={`${styles.requestTypeButton} ${requestType === "NEW"
                ? styles.activeRequestType
                : ""
                }`}
              onClick={() =>
                setRequestType("NEW")
              }
            >

              Create New Company

            </button>

          </div>

          {requestType === "EXISTING" && (

            <div className={styles.formGroup}>

              <label>Select Company</label>

              <select
                className={styles.accountSelect}
                value={selectedCompany}
                onChange={(e) =>
                  setSelectedCompany(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Choose a company
                </option>

                {providerCompanies.map(
                  (company) => (

                    <option
                      key={company.id}
                      value={company.companyName}
                    >

                      {company.companyName}

                    </option>

                  )
                )}

              </select>

            </div>

          )}

          {requestType === "NEW" && (

            <>

              <div className={styles.formGroup}>

                <label>Company Name</label>

                <input
                  className={styles.accountInput}
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) =>
                    setCompanyName(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className={styles.formGroup}>

                <label>Website URL</label>

                <input
                  className={styles.accountInput}
                  placeholder="https://company.com"
                  value={websiteUrl}
                  onChange={(e) =>
                    setWebsiteUrl(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className={styles.formGroup}>

                <label>Payout Account</label>

                <input
                  className={styles.accountInput}
                  placeholder="Enter payout account"
                  value={payoutAccount}
                  onChange={(e) =>
                    setPayoutAccount(
                      e.target.value
                    )
                  }
                />

              </div>

            </>

          )}

        </div>

        <div className={styles.popupActions}>

          <button
            className={styles.popupCancel}
            onClick={onCancel}
          >

            Cancel

          </button>

          <button
            className={styles.popupConfirm}
            onClick={handleRequest}
          >

            Request

          </button>

        </div>

      </div>

    </div>

  );

}
