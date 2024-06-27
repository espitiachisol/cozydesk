import styles from './Login.module.css';
type SignUpFormProps = {
  onSwitch: () => void;
}
export default function SignUpForm({onSwitch}:SignUpFormProps) {
	return (
		<>
			<h2 className={styles.subtitle}>Sign Up</h2>
			<form className={styles.form}>
				<input type="email" placeholder="Email" required />
				<input type="password" placeholder="Password" required />
				<button type="submit">Create account</button>
			</form>
      <aside className={styles.aside}>
				<p>
          Already have an account? &nbsp;<button onClick={onSwitch}> Login </button>
				</p>
			</aside>
		</>
	);
}
