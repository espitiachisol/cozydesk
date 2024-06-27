import { useState } from 'react';
import styles from './SignIn.module.css';
import { signIn } from './UserSlice';
import { useAppDispatch } from '../../app/hook';
type SignInFormProps = {
	onSwitch: () => void;
};
export default function SignInForm({ onSwitch }: SignInFormProps) {
	const dispatch = useAppDispatch();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	async function handleSubmit(e) {
		e.preventDefault();
		await dispatch(signIn({ email, password }));
	}
	return (
		<>
			<h2 className={styles.subtitle}>Sign In</h2>
			<form className={styles.form} onSubmit={handleSubmit}>
				<input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
				<input
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Sign In</button>
			</form>
			<aside className={styles.aside}>
				<p>
					Don't have an account? &nbsp;<button onClick={onSwitch}> Sign up </button>
				</p>
			</aside>
		</>
	);
}
