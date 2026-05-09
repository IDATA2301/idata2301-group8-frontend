import { Tabs } from "@components/Tabs/Tabs";
import styles from "./ProviderRequest.module.css";
import JoinExistingCompanyTab from "./JoinExistingCompanyTab";
import CreateCompanyTab from "./CreateCompanyTab";

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
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupBox}>
        <h3>Become a Ticket Provider</h3>

        <p>
          Send a request to become a ticket provider.
        </p>

        <Tabs
          defaultActiveId="join-company"
          ariaLabel="Provider request options"
          tabPanelClassName={styles.providerRequestTabPanel}
          items={[
            {
              id: "join-company",
              label: "Join Existing Company",
              content: (
                <JoinExistingCompanyTab
                  providerCompanies={providerCompanies}
                  userCompanies={userCompanies}
                  onCancel={onCancel}
                  onConfirm={onConfirm}
                />
              )
            },
            {
              id: "create-company",
              label: "Create New Company",
              content: (
                <CreateCompanyTab
                  onCancel={onCancel}
                  onConfirm={onConfirm}
                />
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
