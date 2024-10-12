import { useAppSelector } from '../../app/hook';
import { PlaylistType } from '../music/type';
import { selectPlaylistIdsByType } from '../music/musicSlice';
import Song from './Song';
import { selectUser } from '../auth/authSlice';
import styles from './Folder.module.css';

type PlaylistProps = {
	playlistType: PlaylistType;
	selectedItems: string[];
	onClickContextMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onClickFile: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Playlist({
	playlistType,
	selectedItems,
	onClickContextMenu,
	onClickFile,
}: PlaylistProps) {
	const user = useAppSelector(selectUser);
	const playlistIds = useAppSelector(selectPlaylistIdsByType(playlistType));

	if (playlistType !== 'system' && !user) {
		return (
			<p className={styles.folderMessage}>
				{' '}
				☝️ Please sign in or sign up first.
			</p>
		);
	}

	if (playlistIds.length < 1) {
		return (
			<p className={styles.folderMessage}>
				{' '}
				☝️ No songs available. Please drag and drop files into this window.
			</p>
		);
	}

	return playlistIds.map((id) => (
		<Song
			key={id}
			playlistType={playlistType}
			songId={id}
			selected={selectedItems.includes(id)}
			onClickContextMenu={onClickContextMenu}
			onClickFile={onClickFile}
		/>
	));
}
