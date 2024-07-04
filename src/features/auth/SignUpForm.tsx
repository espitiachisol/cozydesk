import { useState } from 'react';
import styles from './SignIn.module.css';
import { clearError, getAppAuth, signUp } from './authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hook';
type SignUpFormProps = {
	onSwitch: () => void;
};
export default function SignUpForm({ onSwitch }: SignUpFormProps) {
	const dispatch = useAppDispatch();
	const { error } = useAppSelector(getAppAuth);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	async function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
		dispatch(signUp({ email, password }));
	}
	function handleInputChange(setState: React.Dispatch<React.SetStateAction<string>>) {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			setState(e.target.value);
			if (error) dispatch(clearError());
		};
	}
	return (
		<>
			<h2 className={styles.subtitle}>Sign Up</h2>
			<form className={styles.form} onSubmit={handleSubmit}>
				<input
					className={error ? styles.error : ''}
					type="email"
					placeholder="Email"
					required
					value={email}
					onChange={handleInputChange(setEmail)}
				/>
				<input
					className={error ? styles.error : ''}
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={handleInputChange(setPassword)}
				/>
				<button type="submit">Create account</button>
				{error && <p className={styles.errorMessage}>{error}</p>}
			</form>
			<aside className={styles.aside}>
				<p>
					Already have an account? &nbsp;<button onClick={onSwitch}> Sign In </button>
				</p>
			</aside>
		</>
	);
}
