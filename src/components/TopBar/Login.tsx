import { useState, type FormEvent } from "react";
import styles from './DialogContent.module.css';
import Button from "@components/Button/Button";
import { useLogin, type loginResponseError, type loginResponseSuccess } from "@api/iam";
import toast from "@components/Toast";

type Props = {
  onSwitchToSignup: () => void;
};

export default function Login({ onSwitchToSignup }: Props) {

  const { mutateAsync, isPending } = useLogin()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const promise = mutateAsync({ data: { email, password } })
    toast.promise(promise, {
      loading: "Logging in...",
      success: (res) => {
        const response = res as loginResponseSuccess;
        switch (response.status) {
          case 200:
            if (response.data.jwt) {
              localStorage.setItem("jwt", response.data.jwt)
            } else {
              console.log("No JWT received")
            }
            return "Logged in successfully!"
          default:
            return `Unexpected response: ${response.status}`;
        }
      },
      error: (err) => {
        const error = err as loginResponseError;
        switch (error.status) {
          case 401:
            return "Invalid email or password";
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

  const isDisabled = isPending || email.trim() === "" || password.trim() === "";

  return (
    <>
      <h2 className={styles.title}>Welcome back!</h2>
      <p className={styles.paragraph}>Please enter your details.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Email
          <input
            type="text"
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

        <div className={styles.buttonContainer}>
          <Button type="submit" disabled={isDisabled}>Login</Button>
        </div>
      </form>
      <p>Don't have an account? <button className={styles.linkButton} onClick={onSwitchToSignup}>Sign Up</button></p>
    </>
  );
}
