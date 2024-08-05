import { useState } from 'react';
import styles from './SignIn.module.css';
import { clearError, selectAuthErrorMessage, signIn } from './authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hook';
type SignInFormProps = {
	onSwitch: () => void;
};
export default function SignInForm({ onSwitch }: SignInFormProps) {
	const dispatch = useAppDispatch();
	const error = useAppSelector(selectAuthErrorMessage);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	async function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
		await dispatch(signIn({ email, password }));
	}

	function handleInputChange(
		setState: React.Dispatch<React.SetStateAction<string>>
	) {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			setState(e.target.value);
			if (error) dispatch(clearError());
		};
	}
	return (
		<>
			<h2 className={styles.subtitle}>Sign In</h2>
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
				<button type="submit">Sign In</button>
				{error && <p className={styles.errorMessage}>{error}</p>}
			</form>
			<aside className={styles.aside}>
				<p>
					Don't have an account? &nbsp;
					<button onClick={onSwitch}> Sign up </button>
				</p>
			</aside>
		</>
	);
}
