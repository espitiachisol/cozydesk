import { useAppDispatch, useAppSelector } from '../../app/hook';
import Contextmenu from '../../components/Contextmenu/ContextMenu';
import { deleteSong, playSong, selectSongById } from '../music/musicSlice';
import { DragData, Song as SongType } from '../music/type';
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

function createDragImage(name: string): HTMLDivElement {
	const dragImage = document.createElement('div');
	dragImage.textContent = name;
	dragImage.style.cssText = `
		background-color: var(--color-white-transparent-low);
		padding-inline: 1rem .5rem;
		padding-block: .4rem;
		border-radius: .4rem;
		position: absolute;
		top: -1000px;
		font-family: Arial;
		font-size: .8rem;
		width: 9rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-word;
	`;
	return dragImage;
}

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

	const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
		const dragData: DragData = { playlistType, songId };
		e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
		e.dataTransfer.effectAllowed = 'copy';

		const dragImage = createDragImage(song.name);
		document.body.appendChild(dragImage);
		e.dataTransfer.setDragImage(dragImage, 0, 0);

		// Remove the drag image after a short delay
		setTimeout(() => {
			document.body.removeChild(dragImage);
		}, 0);
	};

	const { iconURL, name, id } = song;
	const isUserSong = playlistType === 'user';
	const fullPath = isUserSong ? (song as SongType).fullPath : undefined;

	return (
		<>
			<Contextmenu.Toggle
				onClickContextMenu={onClickContextMenu}
				id={id}
				onClickToggle={onClickFile}
				onDragStart={handleDragStart}
				className={`${styles.song} ${selected ? styles.selected : ''}`}
			>
				<img src={iconURL} draggable={false} alt={name} />
				<p>{name}</p>
			</Contextmenu.Toggle>
			<Contextmenu.List id={id}>
				<Contextmenu.Button
					onClick={() => {
						dispatch(playSong({ playlistType, songId: id }));
						void dispatch(openWindowAsync({ id: SYSTEM_WINDOW_MUSIC_PLAYER }));
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
