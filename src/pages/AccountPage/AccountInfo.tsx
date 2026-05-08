import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "@components/Toast";

import styles from "./AccountInfo.module.css";

import ConfirmationPopup from "./ConfirmationPopup";
import ProviderRequestPopup from "./ProviderRequestPopup";

import EditIcon from "@assets/icons/edit.svg";
import LogoutIcon from "@assets/icons/logout.svg";
import XIcon from "@assets/icons/x.svg";

interface ProviderCompany {

  id: number;

  companyName: string;

}

interface Props {

  user: {

    email: string;

    role: string;

    providerCompanies: ProviderCompany[];

  };

}

export default function AccountInfo({
  user
}: Props) {

  const navigate = useNavigate();

  const [isEditing, setIsEditing] =
    useState(false);

  const [showLogoutPopup, setShowLogoutPopup] =
    useState(false);

  const [showDeletePopup, setShowDeletePopup] =
    useState(false);

  const [
    showProviderPopup,
    setShowProviderPopup
  ] = useState(false);

  const [email, setEmail] = useState(
    user.email
  );

  const [password, setPassword] =
    useState("");

  return (

    <>

      <div className={styles.accountSections}>

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
                onClick={() =>
                  setShowLogoutPopup(true)
                }
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

      {showLogoutPopup && (

        <ConfirmationPopup
          title="Log Out"
          message="Are you sure you want to log out?"
          onCancel={() =>
            setShowLogoutPopup(false)
          }
          onConfirm={() => {

            localStorage.removeItem(
              "token"
            );

            toast.success(
              "Logged out",
              {
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
              }
            );

            setShowLogoutPopup(false);

            setTimeout(() => {

              navigate("/");

            }, 150);

          }}
        />

      )}

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

              // await deleteAccount()

              localStorage.removeItem(
                "token"
              );

              toast.error(
                "Account deleted",
                {
                  style: {
                    background: "#C1121F",
                    color: "#FFFFFF"
                  }
                }
              );

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
          providerCompanies={
            user.providerCompanies
          }
          onCancel={() =>
            setShowProviderPopup(false)
          }
          onConfirm={() => {

            toast.success(
              "Provider request sent",
              {
                style: {
                  background: "#669BBC",
                  color: "#FFFFFF"
                }
              }
            );

            setShowProviderPopup(false);

          }}
        />

      )}

    </>

  );

}
