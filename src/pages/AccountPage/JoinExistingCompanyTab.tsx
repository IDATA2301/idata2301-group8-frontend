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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isSubmitting = createCompanyRoleChangeRequest.isPending;

  const availableCompanies = providerCompanies.filter((company) => {
    const alreadyExists = userCompanies.some(
      (userCompany) => userCompany.companyId === company.id
    );

    return !alreadyExists;
  });

  const selectedCompanyName =
    availableCompanies.find((company) => company.id === selectedCompany)
      ?.companyName || "Choose a company";

  async function handleJoinCompany() {
    if (!selectedCompany) {
      toast.error("Please select a company");
      return;
    }

    if (companyRolesQuery.isLoading) {
      toast.error("Company roles are still loading");
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

        <div className={styles.customSelect}>
          <button
            type="button"
            disabled={isSubmitting}
            className={styles.customSelectButton}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <span>{selectedCompanyName}</span>
            <span className={styles.customSelectArrow}>⌄</span>
          </button>

          {dropdownOpen && (
            <div className={styles.customSelectMenu}>
              {availableCompanies.length === 0 ? (
                <button
                  type="button"
                  disabled
                  className={styles.customSelectOption}
                >
                  No companies available
                </button>
              ) : (
                availableCompanies.map((company) => (
                  <button
                    type="button"
                    key={company.id}
                    className={styles.customSelectOption}
                    onClick={() => {
                      setSelectedCompany(company.id);
                      setDropdownOpen(false);
                    }}
                  >
                    {company.companyName}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
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
          onClick={handleJoinCompany}
        >
          {isSubmitting ? "Sending..." : "Request"}
        </button>
      </div>
    </>
  );
}
