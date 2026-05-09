import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export type ConfirmOptions = {
  title: string,
  message: string,
  confirmText?: string,
  isDanger?: boolean,
};

type ConfirmOptionsInternal = {
  title: string,
  message: string,
  confirmText: string,
  isDanger: boolean,
  resolve: (value: boolean) => void,
}

export type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const [config, setConfig] = useState<ConfirmOptionsInternal | null>(null);

  useEffect(() => {
    if (config) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [config]);

  const confirm = ({ confirmText = "yes", isDanger = false, ...options }: ConfirmOptions) => {
    if (config) {
      return Promise.reject(new Error("Confirmation already active"));
    }
    return new Promise<boolean>((resolve) => {
      setConfig({ ...options, confirmText, isDanger, resolve });
    });
  }

  const handleClose = (value: boolean) => {
    setConfig(current => {
      current?.resolve(value);
      return null;
    });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {config && (
        <dialog ref={ref} closedby="any" onCancel={() => handleClose(false)}>
          <h3>{config.title}</h3>
          <p>{config.message}</p>
          <button onClick={() => handleClose(false)}>Cancel</button>
          <button onClick={() => handleClose(true)}>{config.confirmText}</button>
        </dialog>
      )}
      {children}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}
