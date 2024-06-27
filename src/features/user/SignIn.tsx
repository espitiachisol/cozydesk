import { useState } from 'react';
import Window from '../window/Window';
import styles from './SignIn.module.css';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
type SignInProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>;
};

export default function SignIn({ containerRef }: SignInProps) {
	const [isSignIn, setIsSignIn] = useState(true);
	function handleSwitch() {
		setIsSignIn((pre) => !pre);
	}
	return (
		<Window containerRef={containerRef} id="signIn" className={styles.SignInLayout}>
			<h1 className={styles.title}>Welcome to CozyDesk</h1>
			{isSignIn && <SignInForm onSwitch={handleSwitch} />}
			{!isSignIn && <SignUpForm onSwitch={handleSwitch} />}
			<img src="/images/sign-in-background.jpg" className={styles.image} draggable={false} />
			<Window.Header className={styles.folderDraggable} />
		</Window>
	);
}
