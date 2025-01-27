import { useRef } from 'react';
import { useAppSelector } from '../../app/hook';
import { getWindows } from '../../features/window/windowSlice';
import MusicPlayer from '../../features/music/MusicPlayer';
import Folder from '../../features/folder/Folder';
import SignIn from '../../features/auth/SignIn';
import Pomodoro from '../../features/pomodoro/Pomodoro';
import { selectUser } from '../../features/auth/authSlice';
import {
	SYSTEM_WINDOW_ENTRY,
	SYSTEM_WINDOW_FOLDER,
	SYSTEM_WINDOW_MUSIC_PLAYER,
	SYSTEM_WINDOW_POMODORO,
} from '../../features/window/constants';
import Dock from './Dock/Dock';
import styles from './Body.module.css';

function Body() {
	const containerRef = useRef<HTMLElement | null>(null);
	const windows = useAppSelector(getWindows);
	const user = useAppSelector(selectUser);

	const isMusicPlayerOpen = windows.some(
		(window) => window.id === SYSTEM_WINDOW_MUSIC_PLAYER && window.isOpen
	);
	const isFolderOpen = windows.some(
		(window) => window.id === SYSTEM_WINDOW_FOLDER && window.isOpen
	);
	const isEntryOpen = windows.some(
		(window) => window.id === SYSTEM_WINDOW_ENTRY && window.isOpen
	);

	const isPomodoroOpen = windows.some(
		(window) => window.id === SYSTEM_WINDOW_POMODORO && window.isOpen
	);

	return (
		<main className={styles.AppBody} ref={containerRef}>
			{isMusicPlayerOpen && <MusicPlayer containerRef={containerRef} />}
			{isFolderOpen && <Folder containerRef={containerRef} />}
			{isPomodoroOpen && <Pomodoro containerRef={containerRef} />}
			{!user && isEntryOpen && <SignIn containerRef={containerRef} />}
			<Dock />
		</main>
	);
}
export default Body;
