import { useAppSelector } from '../../app/hook';
import { PlaylistType } from '../music/type';
import { selectFetchStatus, selectPlaylistIdsByType } from '../music/musicSlice';
import Song from './Song';

type PlaylistProps = {
	playlistType: PlaylistType;
	selectedItems: string[];
	handleClickContextMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
	handleClickFile: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Playlist({
	playlistType,
	selectedItems,
	handleClickContextMenu,
	handleClickFile
}: PlaylistProps) {
	const fetchStatus = useAppSelector(selectFetchStatus);
	const playlistIds = useAppSelector(selectPlaylistIdsByType(playlistType));

	if (fetchStatus === 'loading') {
		return <div>Loading...</div>;
	}

	if (fetchStatus === 'failed') {
		return <div>Error</div>;
	}

	if (playlistIds.length < 1) {
		return <div>No playlist</div>;
	}

	return playlistIds.map((id) => (
		<Song
			key={id}
			playlistType={playlistType}
			songId={id}
			selected={selectedItems.includes(id)}
			onClickContextMenu={handleClickContextMenu}
			onClickToggle={handleClickFile}
		/>
	));
}
