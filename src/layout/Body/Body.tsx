import { useRef } from 'react';
import styles from './Body.module.css';
import { useAppSelector, useAppDispatch } from '../../app/hook'
import { MusicPlayer } from '../../features/MusicPlayer/MusicPlayer';
import { openWindow, getWindows } from '../../features/Window/windowSlice';

function Body() {
	const containerRef = useRef<HTMLElement | null>(null);
	const windows = useAppSelector(getWindows)
  const dispatch = useAppDispatch()
	const isMusicPlayerOpen = windows.some(window => window.id === 'musicPlayer' && window.isOpen);

	return (
		<main className={styles.AppBody} ref={containerRef}>
			{isMusicPlayerOpen && <MusicPlayer containerRef={containerRef} />}
			<fieldset className={styles.AppIconsLayout}>
				<button onClick={() => {}}>
					<img src="/icons/desktop-folder.png" draggable={false}/>
					Folder
				</button>
				<button onClick={() => dispatch(openWindow({id:'musicPlayer'}))}>
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
