import { useState } from "react";
import toast from "@components/Toast";
import {
  useCreateCompanyRoleChangeRequest,
  useGetCompanies,
  useGetCompanyRoles
} from "@api/iam";
import styles from "./ProviderRequest.module.css";


interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function JoinExistingCompanyTab({ onConfirm, onCancel }: Props) {
  const { mutateAsync, isPending } = useCreateCompanyRoleChangeRequest();
  const { data: companiesResponse, isSuccess: companiesSuccess } = useGetCompanies();
  const { data: companyRolesResponse, isSuccess: companyRolesSuccess } = useGetCompanyRoles();
  const [selectedCompany, setSelectedCompany] = useState<number | "">("");

  async function handleJoinCompany() {
    if (!selectedCompany) {
      toast.error("Please select a company");
      return;
    }

    if (!companyRolesSuccess) {
      toast.error("Failed to load company roles");
      return
    }

    const providerRole = companyRolesResponse.data.find(
      (role) => role.name?.toUpperCase() === "ADMIN"
    );

    if (typeof providerRole?.id !== "number") {
      toast.error("Provider role not found");
      return;
    }

    try {
      await mutateAsync({
        data: {
          roleId: providerRole.id,
          companyId: selectedCompany
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
        <label htmlFor="provider-company-select">Select Company</label>

        <select
          id="provider-company-select"
          disabled={!companiesResponse}
          className={styles.accountSelect}
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(Number(e.target.value))}
        >
          <option value="">Choose a company</option>

          {companiesSuccess &&
            companiesResponse.data.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.popupActions}>
        <button className={styles.popupCancel} onClick={onCancel}>Cancel</button>
        <button
          disabled={isPending || !selectedCompany}
          className={styles.popupConfirm}
          onClick={handleJoinCompany}
        >
          {isPending ? "Sending..." : "Request"}
        </button>
      </div>
    </>
  );
}
