import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "@components/Toast";
import { useDeleteUser, useUpdateUser } from "@api/iam";
import EditIcon from "@assets/icons/edit.svg";
import LogoutIcon from "@assets/icons/logout.svg";
import XIcon from "@assets/icons/x.svg";
import { useConfirm } from "@utility/ConfirmContext";
import styles from "./AccountInfo.module.css";
import ProviderRequestPopup from "./ProviderRequestPopup";
import { useAuthContext } from "@utility/AuthContext";

export default function AccountInfo() {
  const { user, isLoggedIn, isAdmin, isProvider, logout } = useAuthContext();
  const navigate = useNavigate();
  const { mutateAsync: deleteUserMutation } = useDeleteUser();
  const { confirm } = useConfirm();
  const { mutate: updateUserMutation, isPending: isUpdatingUser } = useUpdateUser();

  if (!isLoggedIn) {
    return null;
  }

  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const providerRequestPopupRef = useRef<HTMLDialogElement>(null);

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Log Out",
      message: "Are you sure you want to log out?"
    });

    if (!confirmed) {
      return;
    }

    logout();

    toast.success("Logged out", {
      icon: (
        <img
          src={LogoutIcon}
          alt="Logout"
          style={{ width: "18px", height: "18px" }}
        />
      ),
      style: {
        background: "#001824",
        color: "#FFFFFF"
      }
    });

    setTimeout(() => {
      navigate("/");
    }, 150);
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: "Delete Account",
      message: "Are you sure you want to delete the account?",
      confirmText: "Delete",
      isDanger: true
    });

    if (!confirmed) {
      return;
    }

    try {
      await deleteUserMutation({ id: user.id });
      logout();
      toast.error("Account deleted", {
        style: {
          background: "#C1121F",
          color: "#FFFFFF"
        }
      });

      setTimeout(() => {
        navigate("/");
      }, 150);
    } catch {
      toast.error("Failed to delete account");
    }
  };

  const handleSaveChanges = () => {
    setIsEditing(false);

    if (email === user.email && !password) {
      return;
    }

    updateUserMutation({
      id: user.id,
      data: {
        ...(email ? { email } : {}),
        ...(password ? { password } : {})
      }
    }, {
      onError: () => toast.error("Failed to update account"),
      onSuccess: () => toast.success("Account updated")
    });
  }

  return (
    <>
      <div
        className={`${styles.accountSections} ${isProvider ? styles.withCompanies : styles.fullWidth
          }`}
      >
        <div className={styles.contentCard}>
          <h2>Account Information</h2>

          <div className={styles.infoRow}>
            <span>Email</span>

            <input
              className={`${styles.accountInput} ${!isEditing ? styles.disabledInput : ""
                }`}
              value={email}
              disabled={!isEditing}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="MyEmail@gmail.com"
            />
          </div>

          <div className={styles.infoRow}>
            <span>Password</span>

            <input
              type="password"
              className={`${styles.accountInput} ${!isEditing ? styles.disabledInput : ""
                }`}
              value={password}
              disabled={!isEditing}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className={styles.saveButtonContainer}>
            <div className={styles.accountActionsLeft}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                <img src={LogoutIcon} alt="Logout" className={styles.buttonIcon} />
                Log out
              </button>

              <button className={styles.deleteButton} onClick={handleDeleteAccount}>
                <img alt="Delete" src={XIcon} className={styles.buttonIcon} />
                Delete Account
              </button>
            </div>

            {!isEditing ? (
              <button className={styles.saveButton} onClick={() => setIsEditing(true)} disabled={isUpdatingUser}>
                <img src={EditIcon} alt="Edit" className={styles.buttonIcon} />
                {isUpdatingUser ? "Saving..." : "Edit"}
              </button>
            ) : (
              <button className={styles.saveButton} onClick={handleSaveChanges}>
                Save Changes
              </button>
            )}
          </div>
        </div>

        {!isAdmin && (
          <div className={styles.contentCard}>
            <h2>
              {isProvider
                ? "Represent Another Company"
                : "Become a Ticket Provider"}
            </h2>

            <p className={styles.roleChangeText}>
              {isProvider
                ? "Want to become a provider for another company? You can represent more than one company!"
                : "Want to create and manage events? Send a request to become a ticket provider."}
            </p>

            <button
              className={styles.primaryButton}
              onClick={() => providerRequestPopupRef.current?.showModal()}
            >
              Request Access
            </button>
          </div>
        )}
      </div>

      <ProviderRequestPopup ref={providerRequestPopupRef} />
    </>
  );
}
