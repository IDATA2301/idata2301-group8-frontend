import { useState } from "react";
import toast from "@components/Toast";
import { useCreateCompanyCreationRequest } from "@api/iam";
import styles from "./ProviderRequest.module.css";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CreateCompanyTab({
  onCancel,
  onConfirm
}: Props) {
  const createCompanyCreationRequest = useCreateCompanyCreationRequest();
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [payoutAccount, setPayoutAccount] = useState("");
  const isSubmitting = createCompanyCreationRequest.isPending;

  async function handleCreateCompany() {
    if (!companyName.trim() || !payoutAccount.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (websiteUrl && !websiteUrl.startsWith("http")) {
      toast.error("Invalid website URL");
      return;
    }

    try {
      await createCompanyCreationRequest.mutateAsync({
        data: {
          name: companyName.trim(),
          payoutAccount: payoutAccount.trim()
        }
      });

      toast.success("Provider request sent");
      onConfirm();
    } catch (error: any) {
      toast.error(error?.message || "Failed to send provider request");
    }
  }

  return (
    <>
      <div className={styles.formGroup}>
        <label>Company Name</label>

        <input
          disabled={isSubmitting}
          className={styles.accountInput}
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Website URL (optional)</label>

        <input
          disabled={isSubmitting}
          className={styles.accountInput}
          placeholder="https://company.com"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Payout Account</label>

        <input
          disabled={isSubmitting}
          className={styles.accountInput}
          placeholder="Enter payout account"
          value={payoutAccount}
          onChange={(e) => setPayoutAccount(e.target.value)}
        />
      </div>

      <div className={styles.popupActions}>
        <button
          disabled={isSubmitting}
          className={styles.popupCancel}
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          disabled={isSubmitting}
          className={styles.popupConfirm}
          onClick={handleCreateCompany}
        >
          {isSubmitting ? "Sending..." : "Request"}
        </button>
      </div>
    </>
  );
}
