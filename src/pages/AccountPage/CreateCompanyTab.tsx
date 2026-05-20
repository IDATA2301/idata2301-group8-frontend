import { useState } from "react";
import toast from "@components/Toast";
import {
  useCreateCompanyCreationRequest,
  useGetCompanies
} from "@api/iam";
import styles from "./ProviderRequest.module.css";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CreateCompanyTab({
  onCancel,
  onConfirm
}: Props) {
  const { isPending, mutateAsync } = useCreateCompanyCreationRequest();
  const { data: companiesResponse, isSuccess: companiesSuccess } = useGetCompanies();
  const [companyName, setCompanyName] = useState("");
  const [payoutAccount, setPayoutAccount] = useState("");

  async function handleCreateCompany() {
    const trimmedCompanyName = companyName.trim();

    if (!trimmedCompanyName || !payoutAccount.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isValidPayoutAccountFormat(payoutAccount)) {
      toast.error("Payout account must use the format 1234.56.78901");
      return;
    }

    if (companiesSuccess && companyNameExists(trimmedCompanyName, companiesResponse.data)) {
      toast.error("A company with this name already exists. Use Join Existing Company instead.");
      return;
    }

    try {
      const response = await mutateAsync({
        data: {
          name: trimmedCompanyName,
          payoutAccount: payoutAccount.trim()
        }
      });

      if (response.status !== 201) {
        toast.error("Failed to send provider request");
        return;
      }

      toast.success("Provider request sent");
      onConfirm();
    } catch (error: any) {
      console.error("Company creation request failed:", error);
      toast.error(error?.message || "Failed to send provider request");
    }
  }

  return (
    <>
      <div className={styles.formGroup}>
        <label>Company Name</label>

        <input
          disabled={isPending}
          className={styles.accountInput}
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Payout Account</label>

        <input
          disabled={isPending}
          className={styles.accountInput}
          placeholder="1234.56.78901"
          value={payoutAccount}
          onChange={(e) => setPayoutAccount(formatPayoutAccount(e.target.value))}
        />
      </div>

      <div className={styles.popupActions}>
        <button
          disabled={isPending}
          className={styles.popupCancel}
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          disabled={isPending}
          className={styles.popupConfirm}
          onClick={handleCreateCompany}
        >
          {isPending ? "Sending..." : "Request"}
        </button>
      </div>
    </>
  );
}

function companyNameExists(
  companyName: string,
  companies: { name?: string }[]
) {
  const normalizedCompanyName = normalizeCompanyName(companyName);

  return companies.some((company) =>
    normalizeCompanyName(company.name ?? "") === normalizedCompanyName
  );
}

function normalizeCompanyName(companyName: string) {
  return companyName.trim().replace(/\s+/g, " ").toLowerCase();
}

function isValidPayoutAccountFormat(payoutAccount: string) {
  return /^\d{4}\.\d{2}\.\d{5}$/.test(payoutAccount);
}

function formatPayoutAccount(payoutAccount: string) {
  const digits = payoutAccount.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 4) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
}
