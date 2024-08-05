import { useAppDispatch, useAppSelector } from '../../app/hook';
import Contextmenu from '../../components/Contextmenu/ContextMenu';
import { palySong, selectSongById } from '../music/musicSlice';
import { openWindow } from '../window/windowSlice';
import styles from './Song.module.css';
type FileProps = {
	playlistType: 'system' | 'user';
	songId: string;
	selected: boolean;
	onClickToggle(event: React.MouseEvent<HTMLButtonElement>): void;
	onClickContextMenu(event: React.MouseEvent<HTMLButtonElement>): void;
};
export default function Song({
	playlistType,
	songId,
	selected,
	onClickToggle,
	onClickContextMenu,
}: FileProps) {
	const dispatch = useAppDispatch();
	const song = useAppSelector(selectSongById(playlistType, songId));
	if (!song) return null;

	const { iconURL, name } = song;
	return (
		<>
			<Contextmenu.Toggle
				onClickContextMenu={onClickContextMenu}
				id={songId}
				onClickToggle={onClickToggle}
				className={`${styles.song} ${selected ? styles.selected : ''}`}
			>
				<img src={iconURL} draggable={false} alt={name} />
				<p>{name}</p>
			</Contextmenu.Toggle>
			<Contextmenu.List id={songId}>
				<Contextmenu.Button
					onClick={() => {
						dispatch(palySong({ playlistType, songId }));
						dispatch(openWindow({ id: 'musicPlayer' }));
					}}
				>
					Play
				</Contextmenu.Button>
				<Contextmenu.Button onClick={() => {}}>Stop</Contextmenu.Button>
			</Contextmenu.List>
		</>
	);
}
