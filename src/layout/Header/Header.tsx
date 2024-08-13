import { useAppDispatch, useAppSelector } from '../../app/hook';
import Menu from '../../components/Menu/Menu';
import { selectUser, signOut } from '../../features/auth/authSlice';
import { addToast } from '../../features/toaster/toasterSlice';
import {
	SYSTEM_WINDOW_ENTRY,
	SYSTEM_WINDOW_FOLDER,
	SYSTEM_WINDOW_MUSIC_PLAYER,
} from '../../features/window/constants';
import { openWindow } from '../../features/window/windowSlice';

import CurrentDateTime from './CurrentDateTime';
import styles from './Header.module.css';

function Header(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	return (
		<header className={styles.AppHeader}>
			<Menu>
				<Menu.Toggle id="cozydesk">
					<img
						className={styles.logo}
						src="/logo.svg"
						alt="The cozydesk logo"
					/>
					Cozydesk
				</Menu.Toggle>
				<Menu.List id="cozydesk">
					<Menu.Button
						onClick={() => dispatch(openWindow({ id: SYSTEM_WINDOW_ENTRY }))}
					>
						{user ? 'Entry' : 'Sign In'}
					</Menu.Button>
					{user && (
						<Menu.Button
							onClick={() => {
								dispatch(signOut());
							}}
						>
							Sign out
						</Menu.Button>
					)}
					{/* <Menu.Button onClick={() => {}}>Setting</Menu.Button>
					<Menu.Button onClick={() => {}}>About Developer</Menu.Button> */}
				</Menu.List>
				<Menu.Toggle id="app">App</Menu.Toggle>
				<Menu.List id="app">
					<Menu.Button
						onClick={() => dispatch(openWindow({ id: SYSTEM_WINDOW_FOLDER }))}
					>
						Folder
					</Menu.Button>
					<Menu.Button
						onClick={() =>
							dispatch(openWindow({ id: SYSTEM_WINDOW_MUSIC_PLAYER }))
						}
					>
						Music Player
					</Menu.Button>
					<Menu.Button
						onClick={() => {
							dispatch(
								addToast({
									message:
										'The feature is not yet complete. Please stay tuned.',
									type: 'info',
								})
							);
						}}
					>
						Todo
					</Menu.Button>
					<Menu.Button
						onClick={() => {
							dispatch(
								addToast({
									message:
										'The feature is not yet complete. Please stay tuned.',
									type: 'info',
								})
							);
						}}
					>
						Pomodoro
					</Menu.Button>
				</Menu.List>
			</Menu>
			<CurrentDateTime />
		</header>
	);
}

export default Header;
