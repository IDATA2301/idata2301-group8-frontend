import styles from "./AccountPage.module.css";

interface Props {
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmationPopup({
  title,
  message,
  confirmText = "Yes",
  isDanger = false,
  onCancel,
  onConfirm
}: Props) {

  return (
    <div className={styles.popupOverlay}>

      <div className={styles.popupBox}>

        <h3>{title}</h3>

        <p>{message}</p>

        <div className={styles.popupActions}>

          <button
            className={styles.popupCancel}
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className={
              isDanger
                ? styles.popupDelete
                : styles.popupConfirm
            }
            onClick={onConfirm}
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );

}
