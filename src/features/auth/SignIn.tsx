import { useState } from 'react';
import Window from '../../components/Window/Window';
import styles from './SignIn.module.css';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { SYSTEM_WINDOW_ENTRY } from '../window/constants';
import {
	bringToFront,
	closeWindowAsync,
	getWindowById,
	moveWindow,
	resizeWindow,
} from '../window/windowSlice';
type SignInProps = {
	containerRef?: React.MutableRefObject<HTMLElement | null>;
};

export default function SignIn({ containerRef }: SignInProps) {
	const id = SYSTEM_WINDOW_ENTRY;
	const dispatch = useAppDispatch();
	const window = useAppSelector(getWindowById(id));
	const [isSignIn, setIsSignIn] = useState(true);

	if (!window) return null;

	function handleSwitch() {
		setIsSignIn((pre) => !pre);
	}

	const handleResize = (size: { width: number; height: number }) => {
		void dispatch(resizeWindow({ id, size }));
	};

	const handleMove = (position: { x: number; y: number }) => {
		void dispatch(moveWindow({ id, position }));
	};

	const handleBringToFront = () => {
		dispatch(bringToFront({ id }));
	};

	const handleClose = () => {
		void dispatch(closeWindowAsync({ id }));
	};

	return (
		<Window
			containerRef={containerRef}
			className={styles.SignInLayout}
			position={window.position}
			size={window.size}
			zIndex={window.zIndex}
			onResize={handleResize}
			onMove={handleMove}
			onBringToFront={handleBringToFront}
			onClose={handleClose}
			isResizable={false}
		>
			{isSignIn && <SignInForm onSwitch={handleSwitch} />}
			{!isSignIn && <SignUpForm onSwitch={handleSwitch} />}
			<Window.DragArea />
		</Window>
	);
}
