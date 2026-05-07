import { useState } from "react";

import styles from "./AccountPage.module.css";

import ConfirmationPopup from "./ConfirmationPopup";

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

    availableRoles: string[];

    providerCompany?: string;

    providerCompanies: ProviderCompany[];
  };
}

export default function AccountInfo({
  user
}: Props) {

  const [isEditing, setIsEditing] =
    useState(false);

  const [showLogoutPopup, setShowLogoutPopup] =
    useState(false);

  const [showDeletePopup, setShowDeletePopup] =
    useState(false);

  const [email, setEmail] = useState(
    user.email
  );

  const [password, setPassword] =
    useState("");

  const [selectedRole, setSelectedRole] =
    useState(user.role);

  const [providerCompany, setProviderCompany] =
    useState(
      user.providerCompany || ""
    );

  const isProvider =
    selectedRole === "EVENT_PROVIDER";

  function formatRole(role: string) {

    return role
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

  }

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

          <div className={styles.infoRow}>

            <span>Role</span>

            <select
              className={`${styles.accountSelect} ${!isEditing
                ? styles.disabledInput
                : ""
                }`}
              value={selectedRole}
              disabled={!isEditing}
              onChange={(e) =>
                setSelectedRole(
                  e.target.value
                )
              }
            >

              {user.availableRoles.map(
                (role) => (

                  <option
                    key={role}
                    value={role}
                  >

                    {formatRole(role)}

                  </option>

                )
              )}

            </select>

          </div>

          {isProvider && (

            <div className={styles.infoRow}>

              <span>Provider Company</span>

              <select
                className={`${styles.accountSelect} ${!isEditing
                  ? styles.disabledInput
                  : ""
                  }`}
                value={providerCompany}
                disabled={!isEditing}
                onChange={(e) =>
                  setProviderCompany(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select a provider
                </option>

                {user.providerCompanies.map(
                  (company) => (

                    <option
                      key={company.id}
                      value={
                        company.companyName
                      }
                    >

                      {company.companyName}

                    </option>

                  )
                )}

              </select>

            </div>

          )}

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
                onClick={() =>
                  setIsEditing(false)
                }
              >

                Save Changes

              </button>

            )}

          </div>

        </div>

        <div className={styles.contentCard}>

          <h2>Create a Ticket Provider</h2>

          <div className={styles.formGroup}>

            <label>Company Name</label>

            <input
              className={styles.accountInput}
              placeholder="Enter company name"
              autoComplete="off"
              data-lpignore="true"
            />

          </div>

          <div className={styles.formGroup}>

            <label>Website URL</label>

            <input
              className={styles.accountInput}
              placeholder="https://company.com"
            />

          </div>

          <div className={styles.formGroup}>

            <label>Payout Account</label>

            <input
              className={styles.accountInput}
              placeholder="Enter payout account"
            />

          </div>

          <button className={styles.primaryButton}>
            Request Provider
          </button>

        </div>

        <div className={`${styles.contentCard} ${styles.roleChangeCard}`}>

          <h2>Request Role Change</h2>

          <p className={styles.roleChangeText}>

            Want to switch roles?
            You can request access to another role,
            such as becoming an Event Provider.

          </p>

          <button className={styles.primaryButton}>
            Request Role Change
          </button>

        </div>

      </div>

      {showLogoutPopup && (

        <ConfirmationPopup
          title="Log Out"
          message="Are you sure you want to log out?"
          onCancel={() =>
            setShowLogoutPopup(false)
          }
          onConfirm={() => {

            setShowLogoutPopup(false);

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
          onConfirm={() => {

            setShowDeletePopup(false);

          }}
        />

      )}

    </>

  );

}
