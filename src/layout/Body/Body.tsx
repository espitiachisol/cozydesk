import { useRef } from 'react';
import styles from './Body.module.css';
import { MusicPlayer } from '../../features/MusicPlayer/MusicPlayer';

function Body() {
	const containerRef = useRef<HTMLElement | null>(null);

	return (
		<main className={styles.AppBody} ref={containerRef}>
			<MusicPlayer containerRef={containerRef} />
			<fieldset className={styles.AppIconsLayout}>
				<button>
					<img src="/icons/desktop-folder.png" />
					Folder
				</button>
				<button>
					<img src="/icons/desktop-musicPlayer.png" />
					Music Player
				</button>
				<button>
					<img src="/icons/desktop-todo.png" />
					Todo
				</button>
				<button>
					<img src="/icons/desktop-pomodoro.png" />
					Pomodoro
				</button>
			</fieldset>
		</main>
	);
}
export default Body;
