import xIcon from "@assets/icons/x.svg";
import styles from "./UserManagement.module.css";
import { useDeleteUser, useGetGlobalRoles, useGetUsers } from "@api/iam";

export default function UserManagement() {
  const usersQuery = useGetUsers();
  const globalRolesQuery = useGetGlobalRoles();
  const deleteUser = useDeleteUser({
    mutation: { onSuccess: () => usersQuery.refetch() }
  });

  const users = Array.isArray(usersQuery.data?.data) ? usersQuery.data.data : [];
  const globalRoles = Array.isArray(globalRolesQuery.data?.data) ? globalRolesQuery.data.data : [];

  function handleDelete(userId?: string) {
    if (!userId) return;
    deleteUser.mutate({ id: userId });
  }

  return (
    <main className={styles.userManagementPage}>
      <section className={styles.pageContent}>
        <h1>User management</h1>

        <div className={styles.managementBox}>
          <div className={styles.tableHeader}>
            <span>user_id</span>
            <span>email</span>
            <span>role</span>
            <span>created_at</span>
            <span></span>
          </div>

          <div className={styles.entriesList}>
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className={styles.userEntry}>
                  <span title={user.id ?? "-"}>{user.id ?? "-"}</span>
                  <span title={user.email ?? "-"}>{user.email ?? "-"}</span>

                  {/* Requires endpoint: GET /users/{id}/roles or role field on GET /users */}
                  {/* Requires endpoint: PATCH /users/{id}/global-role for direct role management */}
                  {/* Direct role changes could also use POST /approval-requests/global-role-change */}
                  <select defaultValue="" className={styles.roleSelect} disabled>
                    <option value="">unknown</option>
                    {globalRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name ?? `Role ${role.id}`}
                      </option>
                    ))}
                  </select>

                  {/* Requires endpoint: createdAt field on GET /users */}
                  <span title="-">-</span>

                  <button type="button" className={styles.deleteButton} onClick={() => handleDelete(user.id)}>
                    Delete
                    <img src={xIcon} alt="" />
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyMessage}>No users found.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
