import { useEffect, useState } from "react";
import styles from "./CompanySection.module.css";
import { useUpdateCompany, type CompanyDto } from "@api/iam";
import toast from "@components/Toast";

interface Props {
  company: CompanyDto
}

export default function CompanySection({ company }: Props) {
  const { mutate, isPending } = useUpdateCompany();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(company.name || "");
  const [payoutAccount, setPayoutAccount] = useState(company.payoutAccount || "");

  useEffect(() => {
    setName(company.name || "");
    setPayoutAccount(company.payoutAccount || "");
  }, [company.name, company.payoutAccount]);

  function handleSave() {
    if (name.trim() === "" || payoutAccount.trim() === "") {
      toast.error("Please fill in all required fields");
      return;
    }

    if (name === company.name && payoutAccount === company.payoutAccount) {
      setIsEditing(false);
      return;
    }

    if (company.id === undefined) {
      return;
    }

    mutate({
      id: company.id,
      data: {
        name,
        payoutAccount
      }
    }, {
      onSuccess: () => {
        toast.success("Company updated successfully");
        setIsEditing(false);
      },
      onError: () => toast.error("Failed to update company")
    });
  }

  return (
    <div className={styles.companySection}>
      <button
        className={styles.companySectionHeader}
        onClick={() => setOpen(!open)}
      >
        {company.name}
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className={styles.companySectionContent}>
          <div className={styles.formGroup}>
            <label>Company Name</label>

            <input
              className={`${styles.accountInput} ${!isEditing ? styles.disabledInput : ""}`}
              value={name}
              disabled={!isEditing}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Payout Account</label>

            <input
              className={`${styles.accountInput} ${!isEditing ? styles.disabledInput : ""}`}
              value={payoutAccount}
              disabled={!isEditing}
              onChange={(e) => setPayoutAccount(e.target.value)}
            />
          </div>

          <button
            className={styles.primaryButton}
            disabled={isPending}
            onClick={() => {
              if (isEditing) {
                handleSave();
                return;
              }

              setIsEditing(true);
            }}
          >
            {isPending ? "Saving..." : isEditing ? "Save Changes" : "Edit"}
          </button>
        </div>
      )}
    </div>
  );
}
