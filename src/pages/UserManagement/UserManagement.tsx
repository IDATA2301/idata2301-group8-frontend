import xIcon from "@assets/icons/x.svg";
import styles from "./UserManagement.module.css";
import {
  useDeleteUser,
  useGetGlobalRoles,
  useGetUsers,
} from "@api/iam";

export default function UserManagement() {
  const usersQuery = useGetUsers();
  const globalRolesQuery = useGetGlobalRoles();
  const deleteUser = useDeleteUser({
    mutation: {
      onSuccess: () => usersQuery.refetch()
    }
  });

  // TODO: Enable when PATCH /users/{userId} supports updating user role.
  // const updateUser = useUpdateUser({
  //   mutation: {
  //     onSuccess: () => usersQuery.refetch()
  //   }
  // });

  const users = usersQuery.data?.status === 200 ? usersQuery.data.data : [];
  const globalRoles = globalRolesQuery.data?.status === 200 ? globalRolesQuery.data.data : [];
  const isSaving = deleteUser.isPending;
  // TODO: Include updateUser.isPending when role editing is enabled.
  // const isSaving = deleteUser.isPending || updateUser.isPending;

  function handleDelete(userId?: string) {
    if (!userId || isSaving) {
      return;
    }

    deleteUser.mutate({ id: userId });
  }

  // TODO: Enable when PATCH /users/{userId} accepts roleId/globalRoleId.
  // function handleRoleChange(userId: string | undefined, roleId: string) {
  //   if (!userId || !roleId || isSaving) {
  //     return;
  //   }
  //
  //   updateUser.mutate({
  //     id: userId,
  //     data: {
  //       roleId: Number(roleId)
  //     }
  //   });
  // }

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

                  {/* TODO: Enable when GET /users returns globalRoleId/globalRoleName for each user. */}
                  {/* <select
                    value={user.globalRoleId?.toString() ?? ""}
                    className={styles.roleSelect}
                    disabled={isSaving}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="">unknown</option>
                    {globalRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name ?? `Role ${role.id}`}
                      </option>
                    ))}
                  </select> */}

                  <select defaultValue="" className={styles.roleSelect} disabled>
                    <option value="">unknown</option>
                    {globalRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name ?? `Role ${role.id}`}
                      </option>
                    ))}
                  </select>

                  {/* TODO: Enable when GET /users returns createdAt. */}
                  {/* <span title={formatDate(user.createdAt)}>
                    {formatDate(user.createdAt)}
                  </span> */}

                  <span title="-">-</span>

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

// TODO: Enable when GET /users returns createdAt.
// function formatDate(date?: string) {
//   return date ? new Date(date).toLocaleDateString("nb-NO") : "-";
// }
