import { useEffect } from 'react';
import Body from './layout/Body/Body';
import Header from './layout/Header/Header';
import { subscribeAuthStateChanged } from './services/auth';
import { useAppDispatch, useAppSelector } from './app/hook';
import { userSignedIn } from './features/auth/authSlice';
import { User } from './features/auth/type';
import Toaster from './features/toaster/Toaster';
import AnimatedLogo from './assets/icons/animated-logo.svg?react';
import {
	fetchUserWindows,
	selectWindowsStatus,
} from './features/window/windowSlice';
import styles from './App.module.css';

function App(): JSX.Element {
	const dispatch = useAppDispatch();
	const windowStatus = useAppSelector(selectWindowsStatus);

	useEffect(() => {
		const unsubscribe = subscribeAuthStateChanged((user: User | null) => {
			if (user) {
				console.log('test')
				dispatch(userSignedIn(user));
				dispatch(fetchUserWindows());
			} else {
				console.log('Not Sign In');
			}
		});

		return () => {
			unsubscribe();
		};
	}, [dispatch]);

	return (
		<>
			<Header />
			<Body />
			{windowStatus === 'loading' && (
				<section className={styles.AppLoader}>
					<AnimatedLogo />
					<p className={styles.loading}>Loading . . .</p>
				</section>
			)}
			<Toaster />
		</>
	);
}

export default App;
