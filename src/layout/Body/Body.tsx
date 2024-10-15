import { useRef } from 'react';
import { useAppSelector } from '../../app/hook';
import { getWindows } from '../../features/window/windowSlice';
import MusicPlayer from '../../features/music/MusicPlayer';
import Folder from '../../features/folder/Folder';
import SignIn from '../../features/auth/SignIn';
import {
	SYSTEM_WINDOW_ENTRY,
	SYSTEM_WINDOW_FOLDER,
	SYSTEM_WINDOW_MUSIC_PLAYER,
} from '../../features/window/constants';
import Dock from './Dock/Dock';
import styles from './Body.module.css';

function Body() {
	const containerRef = useRef<HTMLElement | null>(null);
	const windows = useAppSelector(getWindows);

	const isMusicPlayerOpen = windows.some(
		(window) => window.id === SYSTEM_WINDOW_MUSIC_PLAYER && window.isOpen
	);
	const isFolderOpen = windows.some(
		(window) => window.id === SYSTEM_WINDOW_FOLDER && window.isOpen
	);
	const isEntryOpen = windows.some(
		(window) => window.id === SYSTEM_WINDOW_ENTRY && window.isOpen
	);

	return (
		<main className={styles.AppBody} ref={containerRef}>
			{isMusicPlayerOpen && <MusicPlayer containerRef={containerRef} />}
			{isFolderOpen && <Folder containerRef={containerRef} />}
			{isEntryOpen && <SignIn containerRef={containerRef} />}
			<Dock />
		</main>
	);
}
export default Body;
