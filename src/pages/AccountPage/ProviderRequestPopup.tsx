import { Tabs } from "@components/Tabs/Tabs";
import styles from "./ProviderRequest.module.css";
import JoinExistingCompanyTab from "./JoinExistingCompanyTab";
import CreateCompanyTab from "./CreateCompanyTab";
import type { RefObject } from "react";

type Props = {
  ref: RefObject<HTMLDialogElement | null>;
}

export default function ProviderRequestPopup({ ref }: Props) {
  return (
    <dialog
      ref={ref}
      className={styles.popupBox}
      aria-labelledby="provider-request-title"
      aria-describedby="provider-request-description"
      closedby="any"
      role="dialog"
    >
      <h3 id="provider-request-title">Become a Ticket Provider</h3>
      <p id="provider-request-description">
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
            content: <JoinExistingCompanyTab
              onCancel={() => ref.current?.close()}
              onConfirm={() => ref?.current?.close()}
            />,
          },
          {
            id: "create-company",
            label: "Create New Company",
            content: <CreateCompanyTab
              onCancel={() => ref.current?.close()}
              onConfirm={() => ref?.current?.close()}
            />,
          }
        ]}
      />
    </dialog>
  );
}
