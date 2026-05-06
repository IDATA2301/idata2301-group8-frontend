import styles from "./AccountPage.module.css";

interface Props {
  user: {
    username: string;
    email: string;
    role: string;
  };
}

export default function AccountInfo({
  user
}: Props) {

  return (
    <div className={styles.contentCard}>

      <h2>Account Information</h2>

      <div className={styles.infoRow}>
        <span>Username</span>
        <span>{user.username}</span>
      </div>

      <div className={styles.infoRow}>
        <span>Email</span>
        <span>{user.email}</span>
      </div>

      <div className={styles.infoRow}>
        <span>Role</span>
        <span>{user.role}</span>
      </div>

    </div>
  );
}
