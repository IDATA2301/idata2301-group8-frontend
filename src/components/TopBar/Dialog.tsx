import { useState, type Ref } from "react";
import styles from './Dialog.module.css';
import Login from "./Login";
import Signup from "./Signup";

type Props = {
  ref?: Ref<HTMLDialogElement>;
};

export default function Dialog({ ref }: Props) {

  const [loggingIn, setLoggingIn] = useState(true);
  const switchToSignup = () => setLoggingIn(false);
  const switchToLogin = () => setLoggingIn(true);

  return (
    <dialog ref={ref} className={styles.dialog} closedby="any">
      {loggingIn ?
        <Login onSwitchToSignup={switchToSignup} /> :
        <Signup onSwitchToLogin={switchToLogin} />}
    </dialog>
  );
}
