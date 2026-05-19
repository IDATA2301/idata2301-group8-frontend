import {
  GetApprovalRequestsStatus,
  getApprovalRequests,
  useGetApprovalRequests
} from "@api/iam";
import CompanyRequestManagement from "./CompanyRequestManagement";
import UserRequestManagement from "./UserRequestManagement";
import styles from "./RequestManagement.module.css";

export type ApprovalRequestsData = Extract<
  Awaited<ReturnType<typeof getApprovalRequests>>,
  { status: 200 }
>["data"];

export type ApprovalRequest = ApprovalRequestsData[number];

export default function RequestManagement() {
  const approvalRequestsQuery = useGetApprovalRequests({
    status: GetApprovalRequestsStatus.pending
  });

  const approvalRequests = approvalRequestsQuery.data?.status === 200
    ? approvalRequestsQuery.data.data
    : [];

  return (
    <main className={styles.requestManagementPage}>
      <section className={styles.pageContent}>
        <h1>Request management</h1>
        <UserRequestManagement
          approvalRequests={approvalRequests}
          refetchApprovalRequests={approvalRequestsQuery.refetch}
        />
        <CompanyRequestManagement
          approvalRequests={approvalRequests}
          refetchApprovalRequests={approvalRequestsQuery.refetch}
        />
      </section>
    </main>
  );
}
