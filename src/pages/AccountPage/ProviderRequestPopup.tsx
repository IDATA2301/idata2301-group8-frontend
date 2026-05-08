import { useState } from "react";

import toast from "@components/Toast";

import {
  useCreateCompanyCreationRequest,
  useCreateCompanyRoleChangeRequest,
  useGetCompanyRoles
} from "@api/iam";

import styles from "./AccountPage.module.css";

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

export default function ProviderRequestPopup({
  providerCompanies,
  userCompanies,
  onCancel,
  onConfirm
}: Props) {

  const createCompanyRoleChangeRequest =
    useCreateCompanyRoleChangeRequest();

  const createCompanyCreationRequest =
    useCreateCompanyCreationRequest();

  const companyRolesQuery =
    useGetCompanyRoles();

  const isSubmitting =
    createCompanyRoleChangeRequest.isPending ||
    createCompanyCreationRequest.isPending;

  const [requestType, setRequestType] =
    useState<"EXISTING" | "NEW">("EXISTING");

  const [selectedCompany, setSelectedCompany] =
    useState<number | "">("");

  const [companyName, setCompanyName] =
    useState("");

  const [websiteUrl, setWebsiteUrl] =
    useState("");

  const [payoutAccount, setPayoutAccount] =
    useState("");

  const availableCompanies =
    providerCompanies.filter((company) => {

      const alreadyExists =
        userCompanies.some(
          (userCompany) =>
            userCompany.companyId === company.id
        );

      return !alreadyExists;

    });

  async function handleRequest() {

    try {

      if (requestType === "EXISTING") {

        if (!selectedCompany) {

          toast.error("Please select a company");

          return;

        }

        const providerRole =
          companyRolesQuery.data?.data.find(
            (role) =>
              role.name?.toUpperCase() ===
              "PROVIDER"
          );

        if (!providerRole?.id) {

          toast.error("Provider role not found");

          return;

        }

        await createCompanyRoleChangeRequest.mutateAsync({
          data: {
            roleId: providerRole.id,
            companyId: selectedCompany
          }
        });

      }

      if (requestType === "NEW") {

        if (
          !companyName.trim() ||
          !payoutAccount.trim()
        ) {

          toast.error(
            "Please fill in all required fields"
          );

          return;

        }

        if (
          websiteUrl &&
          !websiteUrl.startsWith("http")
        ) {

          toast.error("Invalid website URL");

          return;

        }

        await createCompanyCreationRequest.mutateAsync({
          data: {
            name: companyName.trim(),
            payoutAccount: payoutAccount.trim()
          }
        });

      }

      toast.success("Provider request sent", {
        style: {
          background: "#669BBC",
          color: "#FFFFFF"
        }
      });

      onConfirm();

    } catch (error: any) {

      toast.error(
        error?.message ||
        "Failed to send provider request"
      );

    }

  }

  return (
    <div className={styles.popupOverlay}>

      <div className={styles.popupBox}>

        <h3>Become a Ticket Provider</h3>

        <p>
          Send a request to become a ticket provider.
        </p>

        <div className={styles.popupForm}>

          <div className={styles.requestTypeSelector}>

            <button
              type="button"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                disabled={
                  isSubmitting ||
                  companyRolesQuery.isLoading
                }
                className={styles.accountSelect}
                value={selectedCompany}
                onChange={(e) =>
                  setSelectedCompany(
                    Number(e.target.value)
                  )
                }
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
          )}

          {requestType === "NEW" && (
            <>

              <div className={styles.formGroup}>

                <label>
                  Company Name
                </label>

                <input
                  disabled={isSubmitting}
                  className={styles.accountInput}
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) =>
                    setCompanyName(e.target.value)
                  }
                />

              </div>

              <div className={styles.formGroup}>

                <label>
                  Website URL (optional)
                </label>

                <input
                  disabled={isSubmitting}
                  className={styles.accountInput}
                  placeholder="https://company.com"
                  value={websiteUrl}
                  onChange={(e) =>
                    setWebsiteUrl(e.target.value)
                  }
                />

              </div>

              <div className={styles.formGroup}>

                <label>
                  Payout Account
                </label>

                <input
                  disabled={isSubmitting}
                  className={styles.accountInput}
                  placeholder="Enter payout account"
                  value={payoutAccount}
                  onChange={(e) =>
                    setPayoutAccount(e.target.value)
                  }
                />

              </div>

            </>
          )}

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
            disabled={
              isSubmitting ||
              companyRolesQuery.isLoading
            }
            className={styles.popupConfirm}
            onClick={handleRequest}
          >
            {isSubmitting
              ? "Sending..."
              : "Request"}
          </button>

        </div>

      </div>

    </div>
  );

}
