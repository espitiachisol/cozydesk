import { useRef } from 'react';
import styles from './Body.module.css';
import { useAppSelector, useAppDispatch } from '../../app/hook'
import { openWindow, getWindows } from '../../features/window/windowSlice';
import MusicPlayer from '../../features/music/MusicPlayer';
import Folder from '../../features/folder/Folder';
import SignIn from '../../features/auth/SignIn';
import { SYSTEM_WINDOW_ENTRY, SYSTEM_WINDOW_FOLDER, SYSTEM_WINDOW_MUSIC_PLAYER } from '../../features/window/constants';

function Body() {
	const containerRef = useRef<HTMLElement | null>(null);
	const windows = useAppSelector(getWindows)
  const dispatch = useAppDispatch()
	const isMusicPlayerOpen = windows.some(window => window.id === SYSTEM_WINDOW_MUSIC_PLAYER && window.isOpen);
	const isFolderOpen = windows.some(window => window.id === SYSTEM_WINDOW_FOLDER && window.isOpen);
	const isEntryOpen = windows.some(window => window.id === SYSTEM_WINDOW_ENTRY && window.isOpen);

	return (
		<main className={styles.AppBody} ref={containerRef}>
			{isMusicPlayerOpen && <MusicPlayer containerRef={containerRef} />}
			{isFolderOpen && <Folder containerRef={containerRef} />}
			{isEntryOpen && <SignIn containerRef={containerRef} />}
			<fieldset className={styles.AppIconsLayout}>
				<button onClick={() => dispatch(openWindow({id:SYSTEM_WINDOW_FOLDER}))}>
					<img src="/icons/desktop-folder.png" draggable={false}/>
					Folder
				</button>
				<button onClick={() => dispatch(openWindow({id: SYSTEM_WINDOW_MUSIC_PLAYER }))}>
					<img src="/icons/desktop-musicPlayer.png" draggable={false}/>
					Music Player
				</button>
				<button onClick={() => {}}>
					<img src="/icons/desktop-todo.png" draggable={false}/>
					Todo
				</button>
				<button onClick={() => {}}>
					<img src="/icons/desktop-pomodoro.png" draggable={false}/>
					Pomodoro
				</button>
			</fieldset>
		</main>
	);
}
export default Body;
