import styles from './Login.module.css';
type LoginFormProps = {
  onSwitch: () => void;
}
export default function LoginForm({onSwitch}: LoginFormProps) {
	return (
		<>
			<h2 className={styles.subtitle}>Login</h2>
			<form className={styles.form}>
				<input type="email" placeholder="Email" required />
				<input type="password" placeholder="Password" required />
				<button type="submit">Login</button>
			</form>
      <aside className={styles.aside}>
				<p>
					Don't have an account? &nbsp;<button onClick={onSwitch}> Sign up </button>
				</p>
			</aside>
		</>
	);
}
