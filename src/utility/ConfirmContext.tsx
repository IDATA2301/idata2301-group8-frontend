import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import styles from "./ConfirmContext.module.css";

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
};

type ConfirmOptionsInternal = {
  title: string;
  message: string;
  confirmText: string;
  isDanger: boolean;
  resolve: (value: boolean) => void;
};

export type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext =
  createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [config, setConfig] =
    useState<ConfirmOptionsInternal | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (config && !dialog.open) {
      dialog.showModal();
    }

    if (!config && dialog.open) {
      dialog.close();
    }
  }, [config]);

  const confirm = ({
    confirmText = "Yes",
    isDanger = false,
    ...options
  }: ConfirmOptions) => {
    if (config) {
      return Promise.reject(
        new Error("Confirmation already active")
      );
    }

    return new Promise<boolean>((resolve) => {
      setConfig({
        ...options,
        confirmText,
        isDanger,
        resolve
      });
    });
  };

  const handleClose = (value: boolean) => {
    const currentConfig = config;

    dialogRef.current?.close();
    setConfig(null);

    currentConfig?.resolve(value);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <dialog
        ref={dialogRef}
        className={styles.confirmDialog}
        onCancel={(event) => {
          event.preventDefault();
          handleClose(false);
        }}
      >
        {config && (
          <div className={styles.confirmBox}>
            <h3>{config.title}</h3>

            <p>{config.message}</p>

            <div className={styles.confirmActions}>
              <button
                className={styles.cancelButton}
                onClick={() => handleClose(false)}
              >
                Cancel
              </button>

              <button
                className={
                  config.isDanger
                    ? styles.dangerButton
                    : styles.confirmButton
                }
                onClick={() => handleClose(true)}
              >
                {config.confirmText}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error(
      "useConfirm must be used within a ConfirmProvider"
    );
  }

  return context;
};
