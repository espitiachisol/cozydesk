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
	resetStatusToIdle,
	selectWindowsStatus,
} from './features/window/windowSlice';
import styles from './App.module.css';
import { Status } from './common/type/type';

function App(): JSX.Element {
	const dispatch = useAppDispatch();
	const windowStatus = useAppSelector(selectWindowsStatus);

	useEffect(() => {
		const unsubscribe = subscribeAuthStateChanged((user: User | null) => {
			if (user) {
				dispatch(userSignedIn(user));
				void dispatch(fetchUserWindows());
			} else if (!user) {
				dispatch(resetStatusToIdle());
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
			{windowStatus === Status.Loading && (
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
