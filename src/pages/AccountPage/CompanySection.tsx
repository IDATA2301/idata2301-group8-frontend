import { useState } from "react";

import styles from "./CompanySection.module.css";

interface Props {
  companyName: string;
  websiteUrl?: string;
  payoutAccount?: string;
  pending?: boolean;
}

export default function CompanySection({
  companyName,
  websiteUrl = "",
  payoutAccount = "",
  pending = false
}: Props) {

  const [open, setOpen] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [website, setWebsite] =
    useState(websiteUrl);

  const [payout, setPayout] =
    useState(payoutAccount);

  function handleSave() {

    console.log({
      companyName,
      website,
      payout
    });

  }

  return (
    <div className={styles.companySection}>

      <button
        className={styles.companySectionHeader}
        onClick={() =>
          setOpen(!open)
        }
      >

        <span>

          {companyName}

          {pending && (
            <span className={styles.pendingBadge}>
              Pending
            </span>
          )}

        </span>

        <span>
          {open ? "−" : "+"}
        </span>

      </button>

      {open && (
        <div className={styles.companySectionContent}>

          <div className={styles.formGroup}>

            <label>
              Company Name
            </label>

            <input
              className={`${styles.accountInput} ${styles.disabledInput}`}
              value={companyName}
              disabled
              readOnly
            />

          </div>

          <div className={styles.formGroup}>

            <label>
              Website URL
            </label>

            <input
              className={`${styles.accountInput} ${!isEditing
                ? styles.disabledInput
                : ""
                }`}
              value={website}
              disabled={pending || !isEditing}
              onChange={(e) =>
                setWebsite(e.target.value)
              }
            />

          </div>

          <div className={styles.formGroup}>

            <label>
              Payout Account
            </label>

            <input
              className={`${styles.accountInput} ${!isEditing
                ? styles.disabledInput
                : ""
                }`}
              value={payout}
              disabled={pending || !isEditing}
              onChange={(e) =>
                setPayout(e.target.value)
              }
            />

          </div>

          {!pending && (
            <button
              className={styles.primaryButton}
              onClick={() => {

                if (isEditing) {
                  handleSave();
                }

                setIsEditing(!isEditing);

              }}
            >
              {isEditing
                ? "Save Changes"
                : "Edit"}
            </button>
          )}

        </div>
      )}

    </div>
  );

}
