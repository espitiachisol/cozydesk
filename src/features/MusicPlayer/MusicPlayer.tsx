import Window from "../../components/Window/Window";
import styles from './MusicPlayer.module.css'
import CassetteTape from "./CassetteTape";

export function MusicPlayer({containerRef}) {
	return (
		<Window containerRef={containerRef}>
			<Window.Header>
				<CassetteTape />
			</Window.Header>
			<Window.Body> hi </Window.Body>
		</Window>
	);
}
