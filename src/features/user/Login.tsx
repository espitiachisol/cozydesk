import { useState } from 'react';
import Window from '../window/Window';
import styles from './Login.module.css';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
type LoginProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>;
};

export default function Login({ containerRef }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  function handleSwitch() {
    setIsLogin(pre=>!pre)
  }
	return (
		<Window containerRef={containerRef} id="login" className={styles.LoginLayout}>
			<h1 className={styles.title}>Welcome to CozyDesk</h1>
			{isLogin && <LoginForm onSwitch={handleSwitch}/>}
			{!isLogin && <SignUpForm onSwitch={handleSwitch}/>}
			<img src="/images/login-background.jpg" className={styles.image} draggable={false} />
			<Window.Header className={styles.folderDraggable} />
		</Window>
	);
}
