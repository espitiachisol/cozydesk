import { useAppDispatch, useAppSelector } from '../../app/hook';
import Contextmenu from '../../components/Contextmenu/ContextMenu';
import { deleteSong, palySong, selectSongById } from '../music/musicSlice';
import { Song as SongType } from '../music/type';
import { SYSTEM_WINDOW_MUSIC_PLAYER } from '../window/constants';
import { openWindowAsync } from '../window/windowSlice';
import styles from './Song.module.css';
type FileProps = {
	playlistType: 'system' | 'user';
	songId: string;
	selected: boolean;
	onClickFile(event: React.MouseEvent<HTMLButtonElement>): void;
	onClickContextMenu(event: React.MouseEvent<HTMLButtonElement>): void;
};
export default function Song({
	playlistType,
	songId,
	selected,
	onClickFile,
	onClickContextMenu,
}: FileProps) {
	const dispatch = useAppDispatch();
	const song = useAppSelector(selectSongById(playlistType, songId));
	if (!song) return null;

	const { iconURL, name, id } = song;
	const isUserSong = playlistType === 'user';
	const fullPath = isUserSong ? (song as SongType).fullPath : undefined;

	return (
		<>
			<Contextmenu.Toggle
				onClickContextMenu={onClickContextMenu}
				id={id}
				onClickToggle={onClickFile}
				className={`${styles.song} ${selected ? styles.selected : ''}`}
			>
				<img src={iconURL} draggable={false} alt={name} />
				<p>{name}</p>
			</Contextmenu.Toggle>
			<Contextmenu.List id={id}>
				<Contextmenu.Button
					onClick={() => {
						dispatch(palySong({ playlistType, songId: id }));
						dispatch(openWindowAsync({ id: SYSTEM_WINDOW_MUSIC_PLAYER }));
					}}
				>
					Play
				</Contextmenu.Button>
				{isUserSong && fullPath && (
					<Contextmenu.Button
						onClick={() => {
							void dispatch(deleteSong({ songId: id, songPath: fullPath }));
						}}
					>
						Delete
					</Contextmenu.Button>
				)}
			</Contextmenu.List>
		</>
	);
}
