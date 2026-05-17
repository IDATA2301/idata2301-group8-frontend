import xIcon from "@assets/icons/x.svg";
import {
  useAssignGlobalRole,
  useDeleteUser,
  useGetGlobalRoles,
  useGetUsers,
  useRemoveGlobalRole,
} from "@api/iam";
import styles from "./UserManagement.module.css";

export default function UserManagement() {
  const usersQuery = useGetUsers();
  const globalRolesQuery = useGetGlobalRoles();

  const deleteUser = useDeleteUser({
    mutation: {
      onSuccess: () => usersQuery.refetch(),
    },
  });

  const assignGlobalRole = useAssignGlobalRole({
    mutation: {
      onSuccess: () => usersQuery.refetch(),
    },
  });

  const removeGlobalRole = useRemoveGlobalRole({
    mutation: {
      onSuccess: () => usersQuery.refetch(),
    },
  });

  const users = usersQuery.data?.status === 200 ? usersQuery.data.data : [];
  const globalRoles = globalRolesQuery.data?.status === 200 ? globalRolesQuery.data.data : [];
  const isSaving = deleteUser.isPending || assignGlobalRole.isPending || removeGlobalRole.isPending;

  function getPrimaryGlobalRoleId(user: (typeof users)[number]) {
    return user.globalRoles?.[0]?.roleId;
  }

  function handleDelete(userId?: string) {
    if (!userId || isSaving) {
      return;
    }

    deleteUser.mutate({ id: userId });
  }

  function handleRoleChange(userId: string | undefined, oldRoleId: number | undefined, newRoleId: string) {
    if (!userId || !newRoleId || isSaving) {
      return;
    }

    const parsedNewRoleId = Number(newRoleId);

    if (Number.isNaN(parsedNewRoleId) || parsedNewRoleId === oldRoleId) {
      return;
    }

    if (oldRoleId) {
      removeGlobalRole.mutate(
        { id: userId, roleId: oldRoleId },
        {
          onSuccess: () => {
            assignGlobalRole.mutate({
              id: userId,
              data: {
                roleId: parsedNewRoleId,
              },
            });
          },
        }
      );
      return;
    }

    assignGlobalRole.mutate({
      id: userId,
      data: {
        roleId: parsedNewRoleId,
      },
    });
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
              users.map((user) => {
                const globalRoleId = getPrimaryGlobalRoleId(user);

                return (
                  <div key={user.id} className={styles.userEntry}>
                    <span title={user.id ?? "-"}>{user.id ?? "-"}</span>
                    <span title={user.email ?? "-"}>{user.email ?? "-"}</span>
                    <select
                      value={globalRoleId?.toString() ?? ""}
                      className={styles.roleSelect}
                      disabled={isSaving}
                      onChange={(e) => handleRoleChange(user.id, globalRoleId, e.target.value)}
                    >
                      <option value="">unknown</option>
                      {globalRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name ?? `Role ${role.id}`}
                        </option>
                      ))}
                    </select>
                    <span title={formatDate(user.createdAt)}>{formatDate(user.createdAt)}</span>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      disabled={isSaving}
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                      <img src={xIcon} alt="" />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className={styles.emptyMessage}>No users found.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("nb-NO") : "-";
}
