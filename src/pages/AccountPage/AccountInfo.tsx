import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "@components/Toast";

import styles from "./AccountInfo.module.css";

import ConfirmationPopup from "./ConfirmationPopup";
import ProviderRequestPopup from "./ProviderRequestPopup";

import { useDeleteUser } from "@api/iam";

import EditIcon from "@assets/icons/edit.svg";
import LogoutIcon from "@assets/icons/logout.svg";
import XIcon from "@assets/icons/x.svg";
import { useConfirm } from "@utility/ConfirmContext";

interface ProviderCompany {
  id: number;
  companyName: string;
}

interface UserCompany {
  companyId: number;
  pending?: boolean;
}

interface Props {
  user: {
    email: string;
    role: string;
    providerCompanies: ProviderCompany[];
    userCompanies: UserCompany[];
  };

  hasCompanies: boolean;
}

export default function AccountInfo({
  user,
  hasCompanies
}: Props) {

  const navigate = useNavigate();

  const deleteUserMutation = useDeleteUser();

  const [isEditing, setIsEditing] =
    useState(false);

  const [showDeletePopup, setShowDeletePopup] =
    useState(false);

  const [showProviderPopup, setShowProviderPopup] =
    useState(false);

  const { confirm } = useConfirm();

  const [email, setEmail] =
    useState(user.email);

  const [password, setPassword] =
    useState("");

  return (
    <>

      <div
        className={`${styles.accountSections} ${hasCompanies
          ? styles.withCompanies
          : styles.fullWidth
          }`}
      >

        <div className={styles.contentCard}>

          <h2>Account Information</h2>

          <div className={styles.infoRow}>

            <span>Email</span>

            <input
              className={`${styles.accountInput} ${!isEditing
                ? styles.disabledInput
                : ""
                }`}
              value={email}
              disabled={!isEditing}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="MyEmail@gmail.com"
            />

          </div>

          <div className={styles.infoRow}>

            <span>Password</span>

            <input
              type="password"
              className={`${styles.accountInput} ${!isEditing
                ? styles.disabledInput
                : ""
                }`}
              value={password}
              disabled={!isEditing}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter new password"
            />

          </div>

          <div className={styles.saveButtonContainer}>

            <div className={styles.accountActionsLeft}>

              <button
                className={styles.logoutButton}
                onClick={async () => {
                  const confirmed = await confirm({
                    title: "Log Out",
                    message: "Are you sure you want to log out?"
                  });

                  if (confirmed) {
                    localStorage.removeItem("token");

                    toast.success("Logged out", {
                      icon: (
                        <img
                          src={LogoutIcon}
                          alt="Logout"
                          style={{
                            width: "18px",
                            height: "18px"
                          }}
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
                  }
                }}
              >

                <img
                  src={LogoutIcon}
                  alt="Logout"
                  className={styles.buttonIcon}
                />

                Log out

              </button>

              <button
                className={styles.deleteButton}
                onClick={() =>
                  setShowDeletePopup(true)
                }
              >

                <img
                  alt="Delete"
                  src={XIcon}
                  className={styles.buttonIcon}
                />

                Delete Account

              </button>

            </div>

            {!isEditing ? (
              <button
                className={styles.saveButton}
                onClick={() =>
                  setIsEditing(true)
                }
              >

                <img
                  src={EditIcon}
                  alt="Edit"
                  className={styles.buttonIcon}
                />

                Edit

              </button>

            ) : (
              <button
                className={styles.saveButton}
                onClick={() => {

                  // save changes here

                  setIsEditing(false);

                }}
              >
                Save Changes
              </button>
            )}

          </div>

        </div>

        {user.role === "NORMAL_USER" && (
          <div className={styles.contentCard}>

            <h2>Become a Ticket Provider</h2>

            <p className={styles.roleChangeText}>
              Want to create and manage events?
              Send a request to become a ticket provider.
            </p>

            <button
              className={styles.primaryButton}
              onClick={() =>
                setShowProviderPopup(true)
              }
            >
              Request Access
            </button>

          </div>
        )}

      </div>

      {showDeletePopup && (
        <ConfirmationPopup
          title="Delete Account"
          message="Are you sure you want to delete the account?"
          isDanger
          onCancel={() =>
            setShowDeletePopup(false)
          }
          onConfirm={async () => {

            try {

              await deleteUserMutation.mutateAsync({ id: "" });

              localStorage.removeItem("token");

              toast.error("Account deleted", {
                style: {
                  background: "#C1121F",
                  color: "#FFFFFF"
                }
              });

              setShowDeletePopup(false);

              setTimeout(() => {
                navigate("/");
              }, 150);

            } catch {

              toast.error(
                "Failed to delete account"
              );

            }

          }}
        />
      )}

      {showProviderPopup && (
        <ProviderRequestPopup
          providerCompanies={user.providerCompanies}
          userCompanies={user.userCompanies}
          onCancel={() =>
            setShowProviderPopup(false)
          }
          onConfirm={() => {
            setShowProviderPopup(false);
          }}
        />
      )}

    </>
  );

}
