import { useState, type RefObject } from "react";
import styles from './Dialog.module.css';
import Login from "./Login";
import Signup from "./Signup";

type Props = {
  ref: RefObject<HTMLDialogElement | null>;
};

export default function Dialog({ ref }: Props) {

  const [loggingIn, setLoggingIn] = useState(true);
  const switchToSignup = () => setLoggingIn(false);
  const switchToLogin = () => setLoggingIn(true);
  const closeDialog = () => ref.current?.close();

  return (
    <dialog ref={ref} className={styles.dialog} closedby="any">
      {loggingIn ?
        <Login switchToSignup={switchToSignup} closeDialog={closeDialog} /> :
        <Signup switchToLogin={switchToLogin} />}
    </dialog>
  );
}
