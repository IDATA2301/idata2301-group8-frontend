import checkIcon from "@assets/icons/check.svg";
import xIcon from "@assets/icons/x.svg";
import styles from "./RequestManagement.module.css";
import {
  ApprovalRequestReviewRequestStatus,
  GetApprovalRequestsStatus,
  getApprovalRequests,
  useGetApprovalRequests,
  useReviewApprovalRequest
} from "@api/iam";

type ApprovalRequestsData = Extract<
  Awaited<ReturnType<typeof getApprovalRequests>>,
  { status: 200 }
>["data"];

type ApprovalRequest = ApprovalRequestsData[number];

export default function RequestManagement() {
  const approvalRequestsQuery = useGetApprovalRequests({
    status: GetApprovalRequestsStatus.pending
  });

  const reviewApprovalRequest = useReviewApprovalRequest({
    mutation: {
      onSuccess: () => approvalRequestsQuery.refetch()
    }
  });

  const approvalRequests = approvalRequestsQuery.data?.status === 200
    ? approvalRequestsQuery.data.data
    : [];

  const roleChangeRequests = approvalRequests.filter((request) =>
    isRoleChangeRequest(request)
  );

  function reviewRequest(
    id: number | undefined,
    status: ApprovalRequestReviewRequestStatus
  ) {
    if (id === undefined) {
      return;
    }

    reviewApprovalRequest.mutate({
      id,
      data: { status }
    });
  }

  return (
    <main className={styles.requestManagementPage}>
      <section className={styles.pageContent}>
        <h1>Request management</h1>

        <section className={styles.requestSection}>
          <h2>Role change requests</h2>

          <div className={styles.requestBox}>
            <div className={styles.roleTableHeader}>
              <span>request_id</span>
              <span>requested_by</span>
              <span>role change to</span>
              <span>requested_at</span>
              <span>approve/reject</span>
            </div>

            <div className={styles.entriesList}>
              {roleChangeRequests.length > 0 ? (
                roleChangeRequests.map((request) => (
                  <div key={request.id} className={styles.roleRequestEntry}>
                    <span title={String(request.id ?? "-")}>
                      {request.id ?? "-"}
                    </span>

                    <span title={request.requestedBy ?? "-"}>
                      {request.requestedBy ?? "-"}
                    </span>

                    <span title={request.role ?? "-"}>
                      {request.role ?? "-"}
                    </span>

                    <span title={formatDate(request.requestedAt)}>
                      {formatDate(request.requestedAt)}
                    </span>

                    <div className={styles.actionButtons}>
                      <button
                        type="button"
                        className={styles.approveButton}
                        aria-label="Approve request"
                        disabled={reviewApprovalRequest.isPending}
                        onClick={() => reviewRequest(
                          request.id,
                          ApprovalRequestReviewRequestStatus.approved
                        )}
                      >
                        <img src={checkIcon} alt="" />
                      </button>

                      <button
                        type="button"
                        className={styles.rejectButton}
                        aria-label="Reject request"
                        disabled={reviewApprovalRequest.isPending}
                        onClick={() => reviewRequest(
                          request.id,
                          ApprovalRequestReviewRequestStatus.rejected
                        )}
                      >
                        <img src={xIcon} alt="" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyMessage}>
                  No role change requests found.
                </p>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function isRoleChangeRequest(
  request: ApprovalRequest
): request is ApprovalRequest & { role?: string } {
  return request.type?.toLowerCase().includes("role") === true;
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("nb-NO") : "-";
}
