import { useState } from 'react';
import Window from '../window/Window';
import styles from './SignIn.module.css';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { useAppSelector } from '../../app/hook';
import { selectUser } from './authSlice';
import { SYSTEM_WINDOW_ENTRY } from '../window/constants';
type SignInProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>;
};

export default function SignIn({ containerRef }: SignInProps) {
	const [isSignIn, setIsSignIn] = useState(true);
	const user = useAppSelector(selectUser);
	function handleSwitch() {
		setIsSignIn((pre) => !pre);
	}

	return (
		<Window
			containerRef={containerRef}
			id={SYSTEM_WINDOW_ENTRY}
			className={styles.SignInLayout}
		>
			<h1 className={styles.title}>Welcome to CozyDesk</h1>
			{user && (
				<>
					<h2 className={styles.subtitle}>Begin your journey to focus now</h2>
					<p className={styles.welcomeMessage}>
						CozyDesk offers a music player, Pomodoro timer, and inspirational
						quotes. <br />
						More features will be added based on the developer's mood.
					</p>
					<p> ^_^</p>
				</>
			)}
			{!user && isSignIn && <SignInForm onSwitch={handleSwitch} />}
			{!user && !isSignIn && <SignUpForm onSwitch={handleSwitch} />}
			<img
				src="/images/sign-in-background.jpg"
				className={styles.image}
				draggable={false}
			/>
			<Window.DragArea />
		</Window>
	);
}
