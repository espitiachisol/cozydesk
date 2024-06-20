import { useRef } from 'react';
import styles from './Body.module.css';
import { MusicPlayer } from '../../features/MusicPlayer/MusicPlayer';

function Body() {
	const containerRef = useRef<HTMLElement | null>(null);

	return (
		<main className={styles.AppBody} ref={containerRef}>
			<MusicPlayer containerRef={containerRef}/>
		</main>
	);
}
export default Body;
