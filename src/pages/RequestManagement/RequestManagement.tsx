import checkIcon from "@assets/icons/check.svg";
import xIcon from "@assets/icons/x.svg";
import styles from "./RequestManagement.module.css";
import {
  ApprovalRequestReviewRequestStatus,
  GetApprovalRequestsStatus,
  useGetApprovalRequests,
  useReviewApprovalRequest
} from "@api/iam";

type ApprovalRequest = {
  id?: number;
  type?: string;
  role?: string;
  status?: string;
  requestedBy?: string;
  requestedAt?: string;
};

export default function RequestManagement() {
  const approvalRequestsQuery = useGetApprovalRequests({ status: GetApprovalRequestsStatus.pending });
  const reviewApprovalRequest = useReviewApprovalRequest({
    mutation: { onSuccess: () => approvalRequestsQuery.refetch() }
  });

  const approvalRequests = Array.isArray(approvalRequestsQuery.data?.data)
    ? approvalRequestsQuery.data.data as unknown as ApprovalRequest[]
    : [];

  const roleChangeRequests = approvalRequests.filter((request) =>
    request.type?.toLowerCase().includes("role")
  );

  function reviewRequest(id: number | undefined, status: ApprovalRequestReviewRequestStatus) {
    if (!id) return;
    reviewApprovalRequest.mutate({ id, data: { status } });
  }

  return (
    <main className={styles.requestManagementPage}>
      <section className={styles.pageContent}>
        <h1>Request management</h1>

        <RequestBox title="Role change requests">
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
                  <span title={String(request.id ?? "-")}>{request.id ?? "-"}</span>
                  <span title={request.requestedBy ?? "-"}>{request.requestedBy ?? "-"}</span>
                  <span title={request.role ?? "-"}>{request.role ?? "-"}</span>
                  <span title={formatDate(request.requestedAt)}>{formatDate(request.requestedAt)}</span>
                  <ActionButtons
                    onApprove={() => reviewRequest(request.id, ApprovalRequestReviewRequestStatus.approved)}
                    onReject={() => reviewRequest(request.id, ApprovalRequestReviewRequestStatus.rejected)}
                  />
                </div>
              ))
            ) : (
              <p className={styles.emptyMessage}>No role change requests found.</p>
            )}
          </div>
        </RequestBox>

        {/* Requires endpoint: GET /approval-requests/event-creation or type filter on GET /approval-requests */}
        {/* Requires endpoint: POST /approval-requests/event-creation from EventManagement create flow */}
        {/* 
        <RequestBox title="Request event creation">
          <div className={styles.eventTableHeader}>
            <span>event_name</span>
            <span>description</span>
            <span>requested_at</span>
            <span>approve/reject</span>
          </div>

          <div className={styles.entriesList}>
            {eventCreationRequests.map((request) => (
              <div key={request.id} className={styles.eventRequestEntry}>
                <span title={request.eventName}>{request.eventName}</span>
                <span title={request.description}>{request.description}</span>
                <span title={formatDate(request.requestedAt)}>{formatDate(request.requestedAt)}</span>
                <ActionButtons
                  onApprove={() => reviewRequest(request.id, ApprovalRequestReviewRequestStatus.approved)}
                  onReject={() => reviewRequest(request.id, ApprovalRequestReviewRequestStatus.rejected)}
                />
              </div>
            ))}
          </div>
        </RequestBox>
        */}
      </section>
    </main>
  );
}

type RequestBoxProps = {
  title: string;
  children: React.ReactNode;
};

type ActionButtonsProps = {
  onApprove: () => void;
  onReject: () => void;
};

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("nb-NO") : "-";
}

function RequestBox({ title, children }: RequestBoxProps) {
  return (
    <section className={styles.requestSection}>
      <h2>{title}</h2>
      <div className={styles.requestBox}>{children}</div>
    </section>
  );
}

function ActionButtons({ onApprove, onReject }: ActionButtonsProps) {
  return (
    <div className={styles.actionButtons}>
      <button type="button" className={styles.approveButton} aria-label="Approve request" onClick={onApprove}>
        <img src={checkIcon} alt="" />
      </button>
      <button type="button" className={styles.rejectButton} aria-label="Reject request" onClick={onReject}>
        <img src={xIcon} alt="" />
      </button>
    </div>
  );
}
