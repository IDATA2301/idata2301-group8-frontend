import { useMemo, useState } from "react";
import xIcon from "@assets/icons/x.svg";
import {
  useAssignGlobalRole,
  useDeleteUser,
  useGetGlobalRoles,
  useGetUsers,
  useRemoveGlobalRole,
} from "@api/iam";
import { useAuthContext } from "@utility/AuthContext";
import { useConfirm } from "@utility/ConfirmContext";
import styles from "./UserManagement.module.css";

export default function UserManagement() {
  const { user: loggedInUser } = useAuthContext();
  const { confirm } = useConfirm();
  const [searchQuery, setSearchQuery] = useState("");
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
  const loggedInUserId = loggedInUser?.id;
  const isSaving = deleteUser.isPending || assignGlobalRole.isPending || removeGlobalRole.isPending;

  const roleNameById = useMemo(() => {
    return new Map(globalRoles.map((role) => [role.id, role.name?.toLowerCase() ?? ""]));
  }, [globalRoles]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const search = searchQuery.toLowerCase();
    return users.filter((user) =>
      (user.email?.toLowerCase().includes(search)) ||
      (user.id?.toLowerCase().includes(search)) ||
      (user.globalRoles?.some((role) => roleNameById.get(role.roleId)?.includes(search)))
    );
  }, [users, searchQuery, roleNameById]);

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.id === loggedInUserId) {
      return -1;
    }

    if (b.id === loggedInUserId) {
      return 1;
    }

    return 0;
  });

  function userHasRole(user: (typeof users)[number], roleId?: number) {
    return roleId !== undefined && user.globalRoles?.some((role) => role.roleId === roleId);
  }

  function isLoggedInUser(userId?: string) {
    return userId !== undefined && userId === loggedInUserId;
  }

  async function handleDelete(userId?: string, email?: string) {
    if (!userId || isSaving || isLoggedInUser(userId)) {
      return;
    }

    const shouldDelete = await confirm({
      title: "Delete user?",
      message: `Are you sure you want to delete ${email ?? "this user"}? This action cannot be undone.`,
      confirmText: "Delete",
      isDanger: true,
    });

    if (!shouldDelete) {
      return;
    }

    deleteUser.mutate({ id: userId });
  }

  async function handleRoleToggle(
    userId: string | undefined,
    roleId: number | undefined,
    checked: boolean,
    roleName?: string,
    userEmail?: string
  ) {
    if (!userId || roleId === undefined || isSaving || isLoggedInUser(userId)) {
      return;
    }

    const shouldChangeRole = await confirm({
      title: checked ? "Assign role?" : "Remove role?",
      message: `Are you sure you want to ${checked ? "assign" : "remove"} ${roleName ?? `Role ${roleId}`} ${checked ? "to" : "from"} ${userEmail ?? "this user"}?`,
      confirmText: checked ? "Assign" : "Remove",
      isDanger: !checked,
    });

    if (!shouldChangeRole) {
      return;
    }

    if (checked) {
      assignGlobalRole.mutate({
        id: userId,
        data: {
          roleId,
        },
      });
      return;
    }

    removeGlobalRole.mutate({
      id: userId,
      roleId,
    });
  }

  async function handleCopyUserId(userId?: string) {
    if (!userId) {
      return;
    }

    await navigator.clipboard.writeText(userId);
  }

  return (
    <main className={styles.userManagementPage}>
      <section className={styles.pageContent}>
        <div className={styles.pageHeader}>
          <h1>User management</h1>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.managementBox}>
          <div className={styles.tableHeader}>
            <span>user_id</span>
            <span>email</span>
            <span>roles</span>
            <span>created_at</span>
            <span></span>
          </div>
          <div className={styles.entriesList}>
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user) => {
                const isOwnUser = isLoggedInUser(user.id);

                return (
                  <div
                    key={user.id}
                    className={`${styles.userEntry} ${isOwnUser ? styles.ownUserEntry : ""}`}
                  >
                    <button
                      type="button"
                      className={styles.userIdButton}
                      title={user.id ? `Copy ${user.id}` : "-"}
                      onClick={() => handleCopyUserId(user.id)}
                    >
                      {user.id ?? "-"}
                    </button>

                    <span title={user.email ?? "-"}>
                      {user.email ?? "-"}
                      {isOwnUser ? " (you)" : ""}
                    </span>

                    <div className={styles.rolesList}>
                      {globalRoles.map((role) => (
                        <label key={role.id} className={styles.roleCheckboxLabel}>
                          <input
                            type="checkbox"
                            checked={userHasRole(user, role.id)}
                            disabled={isSaving || isOwnUser}
                            onChange={(e) =>
                              handleRoleToggle(
                                user.id,
                                role.id,
                                e.target.checked,
                                role.name,
                                user.email
                              )
                            }
                          />
                          <span>{role.name ?? `Role ${role.id}`}</span>
                        </label>
                      ))}
                    </div>

                    <span title={formatDate(user.createdAt)}>
                      {formatDate(user.createdAt)}
                    </span>

                    <button
                      type="button"
                      className={styles.deleteButton}
                      disabled={isSaving || isOwnUser}
                      onClick={() => handleDelete(user.id, user.email)}
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
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
