import { useState } from "react";
import toast from "@components/Toast";
import {
  useCreateCompanyRoleChangeRequest,
  useGetCompanyRoles
} from "@api/iam";
import styles from "./ProviderRequest.module.css";

interface ProviderCompany {
  id: number;
  companyName: string;
}

interface UserCompany {
  companyId: number;
  pending?: boolean;
}

interface Props {
  providerCompanies: ProviderCompany[];
  userCompanies: UserCompany[];
  onCancel: () => void;
  onConfirm: () => void;
}

export default function JoinExistingCompanyTab({
  providerCompanies,
  userCompanies,
  onCancel,
  onConfirm
}: Props) {
  const createCompanyRoleChangeRequest = useCreateCompanyRoleChangeRequest();
  const companyRolesQuery = useGetCompanyRoles();
  const [selectedCompany, setSelectedCompany] = useState<number | "">("");
  const isSubmitting = createCompanyRoleChangeRequest.isPending;

  const availableCompanies = providerCompanies.filter((company) => {
    const alreadyExists = userCompanies.some(
      (userCompany) => userCompany.companyId === company.id
    );

    return !alreadyExists;
  });

  async function handleJoinCompany() {
    if (!selectedCompany) {
      toast.error("Please select a company");
      return;
    }

    const providerRole = companyRolesQuery.data?.data.find(
      (role) => role.name?.toUpperCase() === "PROVIDER"
    );

    if (!providerRole?.id) {
      toast.error("Provider role not found");
      return;
    }

    try {
      await createCompanyRoleChangeRequest.mutateAsync({
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
        <label>Select Company</label>

        <select
          disabled={isSubmitting || companyRolesQuery.isLoading}
          className={styles.accountSelect}
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(Number(e.target.value))}
        >
          <option value="">
            Choose a company
          </option>

          {availableCompanies.map((company) => (
            <option
              key={company.id}
              value={company.id}
            >
              {company.companyName}
            </option>
          ))}
        </select>
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
          disabled={isSubmitting || companyRolesQuery.isLoading}
          className={styles.popupConfirm}
          onClick={handleJoinCompany}
        >
          {isSubmitting ? "Sending..." : "Request"}
        </button>
      </div>
    </>
  );
}
