import { useState } from 'react';
import styles from './SignIn.module.css';
import { clearError, selectAuthErrorMessage } from './authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hook';

type AuthFormProps = {
	onSwitch: () => void;
	onSubmit: (email: string, password: string) => void;
	subtitle: string;
	submitButtonText: string;
	switchText: string;
	switchButtonText: string;
};

export default function AuthForm({
	onSwitch,
	onSubmit,
	subtitle,
	submitButtonText,
	switchText,
	switchButtonText,
}: AuthFormProps) {
	const dispatch = useAppDispatch();
	const error = useAppSelector(selectAuthErrorMessage);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();
		onSubmit(email, password);
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
		<form className={styles.form} onSubmit={handleSubmit}>
			<img
				className={styles.logo}
				src="/flat-logo.svg"
				alt="The cozydesk logo"
			/>
			<h1 className={styles.title}>Welcome to CozyDesk</h1>
			<h2 className={styles.subtitle}>{subtitle}</h2>
			<fieldset className={styles.inputs}>
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
			</fieldset>
			<fieldset className={styles.buttonWrapper}>
				<button type="submit">{submitButtonText}</button>
				{error && <p className={styles.errorMessage}>{error}</p>}
			</fieldset>
			<aside className={styles.aside}>
				<p>
					{switchText} &nbsp;
					<button onClick={onSwitch}>{switchButtonText}</button>
				</p>
			</aside>
		</form>
	);
}
