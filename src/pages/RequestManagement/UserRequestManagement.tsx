import checkIcon from "@assets/icons/check.svg";
import xIcon from "@assets/icons/x.svg";
import toast from "@components/Toast";
import {
  ApprovalRequestReviewRequestStatus,
  useReviewApprovalRequest
} from "@api/iam";
import type { ApprovalRequest } from "./RequestManagement";
import styles from "./RequestManagement.module.css";

type UserRequestManagementProps = {
  approvalRequests: ApprovalRequest[];
  refetchApprovalRequests: () => void;
};

export default function UserRequestManagement({
  approvalRequests,
  refetchApprovalRequests
}: UserRequestManagementProps) {
  const reviewApprovalRequest = useReviewApprovalRequest();

  const roleChangeRequests = approvalRequests.filter(isRoleChangeRequest);

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
    }, {
      onSuccess: () => {
        refetchApprovalRequests();

        if (status === ApprovalRequestReviewRequestStatus.approved) {
          toast.success("Role request approved");
          return;
        }

        toast.success("Role request rejected");
      },
      onError: () => {
        toast.error("Failed to review role request");
      }
    });
  }

  return (
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
