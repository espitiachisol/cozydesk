import { useState } from 'react';
import styles from './SignIn.module.css';
import { signUp } from './userSlice';
import { useAppDispatch, useAppSelector } from '../../app/hook';
type SignUpFormProps = {
	onSwitch: () => void;
};
export default function SignUpForm({ onSwitch }: SignUpFormProps) {
	const dispatch = useAppDispatch();
	const { loading, error, user } = useAppSelector((state) => state.user);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	async function handleSubmit(e) {
		e.preventDefault();
		dispatch(signUp({ email, password }));
	}

	return (
		<>
			<h2 className={styles.subtitle}>Sign Up</h2>
			<form className={styles.form} onSubmit={handleSubmit}>
				<input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
				<input
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Create account</button>
			</form>
			<aside className={styles.aside}>
				<p>
					Already have an account? &nbsp;<button onClick={onSwitch}> Sign In </button>
				</p>
			</aside>
		</>
	);
}
