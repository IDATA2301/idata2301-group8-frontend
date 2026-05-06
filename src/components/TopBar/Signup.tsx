import { useState, type FormEvent } from "react";
import styles from './DialogContent.module.css';
import Button from "@components/Button/Button";
import { useSignup, type signupResponseError, type signupResponseSuccess } from "@api/iam";
import toast from "@components/Toast";

type Props = {
  switchToLogin: () => void;
};

export default function Signup({ switchToLogin }: Props) {

  const { mutateAsync, isPending } = useSignup()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const promise = mutateAsync({ data: { email, password } })
    toast.promise(promise, {
      loading: "Creating account...",
      success: (res) => {
        const response = res as signupResponseSuccess;
        switch (response.status) {
          case 201:
            switchToLogin();
            return "Account created successfully! Please log in.";
          default:
            return `Unexpected response: ${response.status}`;
        }
      },
      error: (err) => {
        const error = err as signupResponseError;
        switch (error.status) {
          case 400:
            return `${error.data}`
          default:
            const fetchError = err as Error;
            if (fetchError.message) {
              return `Unexpected error: ${fetchError.message}`;
            } else {
              return `Something went wrong. Please try again.`;
            }
        }
      },
    });
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isDisabled = isPending || email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "";

  return (
    <>
      <h2 className={styles.title}>Sign up</h2>
      <p className={styles.paragraph}>Please enter your details.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Email
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </label>

        <div className={styles.buttonContainer}>
          <Button type="submit" disabled={isDisabled}>Sign Up</Button>
        </div>
      </form>
      <p>Already have an account? <button className={styles.linkButton} onClick={switchToLogin}>Log in</button></p>
    </>
  );
}
