import checkIcon from "@assets/icons/check.svg";
import xIcon from "@assets/icons/x.svg";
import {
  ApprovalRequestReviewRequestStatus,
  useReviewApprovalRequest
} from "@api/iam";
import type { ApprovalRequest } from "./RequestManagement";
import styles from "./RequestManagement.module.css";

type CompanyRequestManagementProps = {
  approvalRequests: ApprovalRequest[];
  refetchApprovalRequests: () => void;
};

type CompanyCreationRequest = ApprovalRequest & {
  name?: string;
  companyName?: string;
  payoutAccount?: string;
};

export default function CompanyRequestManagement({
  approvalRequests,
  refetchApprovalRequests
}: CompanyRequestManagementProps) {
  const reviewApprovalRequest = useReviewApprovalRequest({
    mutation: {
      onSuccess: refetchApprovalRequests
    }
  });

  const companyCreationRequests = approvalRequests.filter(isCompanyCreationRequest);

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
    <section className={styles.requestSection}>
      <h2>Company creation requests</h2>

      <div className={styles.requestBox}>
        <div className={styles.companyTableHeader}>
          <span>request_id</span>
          <span>company_name</span>
          <span>requested_by</span>
          <span>requested_at</span>
          <span>approve/reject</span>
        </div>

        <div className={styles.entriesList}>
          {companyCreationRequests.length > 0 ? (
            companyCreationRequests.map((request) => {
              const companyName = request.name ?? request.companyName ?? "-";

              return (
                <div key={request.id} className={styles.companyRequestEntry}>
                  <span title={String(request.id ?? "-")}>
                    {request.id ?? "-"}
                  </span>
                  <span title={companyName}>
                    {companyName}
                  </span>
                  <span title={request.requestedBy ?? "-"}>
                    {request.requestedBy ?? "-"}
                  </span>
                  <span title={formatDate(request.requestedAt)}>
                    {formatDate(request.requestedAt)}
                  </span>
                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      className={styles.approveButton}
                      aria-label="Approve company creation request"
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
                      aria-label="Reject company creation request"
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
              );
            })
          ) : (
            <p className={styles.emptyMessage}>
              No company creation requests found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function isCompanyCreationRequest(
  request: ApprovalRequest
): request is CompanyCreationRequest {
  return request.type?.toLowerCase().includes("company") === true;
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("nb-NO") : "-";
}
