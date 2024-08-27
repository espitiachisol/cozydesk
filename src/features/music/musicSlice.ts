import {
	createSlice,
	PayloadAction,
	createAsyncThunk,
	createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { systemPlaylist } from './systemPlaylist';
import {
	deleteSongFromFirestore,
	deleteSongFromStorage,
	getUserPlaylist,
	saveSongToFirestore,
	uploadSongToStorage,
} from '../../services/music';
import { Status } from '../../common/type/type';
import { PlaylistItem, PlaylistType, Song, SystemSong } from './type';
import { addToast, updateToastMessage } from '../toaster/toasterSlice';
import { SYSTEM_WINDOW_MUSIC_PLAYER } from '../window/constants';

interface MusicState {
	systemPlaylist: SystemSong[];
	userPlaylist: Song[];
	activePlaylist: PlaylistType;
	currentSongId: string;
	uploadStatus: Status;
	fetchStatus: Status;
	deleteStatus: Status;
	errorMessage: string | null;
}

// Define the initial state using that type
export const initialState: MusicState = {
	systemPlaylist: systemPlaylist,
	userPlaylist: [],
	activePlaylist: 'system',
	currentSongId: systemPlaylist[0].id,
	uploadStatus: Status.Idle,
	fetchStatus: Status.Idle,
	deleteStatus: Status.Idle,
	errorMessage: null,
};

export const fetchUserPlaylist = createAsyncThunk(
	'music/fetchUserPlaylist',
	async (_, { rejectWithValue }) => {
		const result = await getUserPlaylist();
		if ('error' in result) return rejectWithValue(result.error);
		return result.response;
	}
);

export const deleteSong = createAsyncThunk(
	'music/deleteSong',
	async (
		{ songId, songPath }: { songId: string; songPath: string },
		{ rejectWithValue, dispatch, getState }
	) => {
		const toastId = Date.now().toString();
		const { window, music } = getState() as RootState;
		const isMusicPlayerOpen = window.windows.find(
			(w) => w.id === SYSTEM_WINDOW_MUSIC_PLAYER
		)?.isOpen;

		const isCurrentSongPlaying = music.currentSongId === songId;

		if (isMusicPlayerOpen && isCurrentSongPlaying) {
			const rejectMessage = 'Cannot delete the song that is currently playing.';
			dispatch(
				addToast({
					id: toastId,
					message: rejectMessage,
					type: 'info',
				})
			);
			return rejectWithValue(rejectMessage);
		}

		dispatch(
			addToast({ id: toastId, message: 'Deleting song...', type: 'loading' })
		);

		// Delete from storage
		const deleteStorageResult = await deleteSongFromStorage(songPath);
		if ('error' in deleteStorageResult) {
			dispatch(
				updateToastMessage({
					id: toastId,
					message: deleteStorageResult.error,
					type: 'error',
				})
			);
			return rejectWithValue(deleteStorageResult.error);
		}

		// Delete from Firestore
		const deleteFirestoreResult = await deleteSongFromFirestore(songId);
		if ('error' in deleteFirestoreResult) {
			dispatch(
				updateToastMessage({
					id: toastId,
					message: deleteFirestoreResult.error,
					type: 'error',
				})
			);
			return rejectWithValue(deleteFirestoreResult.error);
		}

		dispatch(
			updateToastMessage({
				id: toastId,
				message: 'Song deleted successfully',
				type: 'success',
			})
		);

		return songId;
	}
);

export const uploadSong = createAsyncThunk(
	'music/uploadSong',
	async (
		{ files }: { files: FileList },
		{ rejectWithValue, getState, dispatch }
	) => {
		const toastId = Date.now().toString();
		const state = getState() as RootState;
		const userPlaylist = state.music.userPlaylist;
		const file = files[0];
		let rejectMessage = '';
		if (files.length > 1) {
			rejectMessage = 'Multiple file uploads are not supported at the moment';
		} else if (userPlaylist.length + 1 > 10) {
			rejectMessage =
				'Each user is limited to 10 songs. Please remove some songs before uploading new ones.';
		} else if (file.size > 10000000) {
			rejectMessage =
				'Your file is too large. Please ensure the file size is within the 10MB limit.';
		}
		if (rejectMessage) {
			dispatch(
				addToast({
					id: toastId,
					message: rejectMessage,
					type: 'info',
				})
			);
			return rejectWithValue(rejectMessage);
		}

		dispatch(
			addToast({ id: toastId, message: 'Uploading music...', type: 'loading' })
		);
		const result = await uploadSongToStorage(file);
		if ('error' in result) {
			dispatch(
				updateToastMessage({
					id: toastId,
					message: result.error,
					type: 'error',
				})
			);
			return rejectWithValue(result.error);
		}
		const { downloadURL, metadata } = result.response;

		const imageId = `${Math.floor(Math.random() * 5 + 1)}`;
		const song: Song = {
			bucket: metadata.bucket,
			fullPath: metadata.fullPath,
			name: metadata.name,
			contentType: metadata.contentType || '',
			size: metadata.size,
			md5Hash: metadata.md5Hash || '',
			timeCreated: metadata.timeCreated,
			downloadURL: downloadURL,
			imageURL: `/images/music-cover-${imageId}.png`,
			iconURL: `/icons/music-cover-${imageId}.png`,
		};
		const saveSongResult = await saveSongToFirestore(song);
		if ('error' in saveSongResult) {
			dispatch(
				updateToastMessage({
					id: toastId,
					message: saveSongResult.error,
					type: 'error',
				})
			);
			return rejectWithValue(saveSongResult.error);
		}
		dispatch(
			updateToastMessage({
				id: toastId,
				message: 'Upload successful',
				type: 'success',
			})
		);
		return saveSongResult.response;
	}
);

interface PlaySongPayload {
	playlistType: 'system' | 'user';
	songId: string;
}

export const musicSlice = createSlice({
	name: 'music',
	initialState,
	reducers: {
		playNextSong: (state) => {
			const playlist =
				state.activePlaylist === 'system'
					? state.systemPlaylist
					: state.userPlaylist;

			const currentSongIndex = playlist.findIndex(
				(song) => song.id === state.currentSongId
			);
			if (currentSongIndex !== -1 && currentSongIndex < playlist.length - 1) {
				state.currentSongId = playlist[currentSongIndex + 1].id;
			} else {
				state.currentSongId = playlist[0].id; // Loop back to the start
			}
		},
		playPreviousSong: (state) => {
			const playlist =
				state.activePlaylist === 'system'
					? state.systemPlaylist
					: state.userPlaylist;
			const currentSongIndex = playlist.findIndex(
				(song) => song.id === state.currentSongId
			);
			if (currentSongIndex > 0) {
				state.currentSongId = playlist[currentSongIndex - 1].id;
			} else {
				state.currentSongId = playlist[playlist.length - 1].id; // Loop to the end
			}
		},
		palySong(state, action: PayloadAction<PlaySongPayload>) {
			const { playlistType, songId } = action.payload;
			state.activePlaylist = playlistType;
			const playlist =
				state.activePlaylist === 'system'
					? state.systemPlaylist
					: state.userPlaylist;
			if (playlist.find((song) => song.id === songId)) {
				state.currentSongId = songId;
			}
		},
		resetMusicSlice: () => {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(uploadSong.pending, (state) => {
				state.uploadStatus = Status.Loading;
				state.errorMessage = null;
			})
			.addCase(uploadSong.fulfilled, (state, action: PayloadAction<Song>) => {
				state.userPlaylist.push(action.payload);
				state.uploadStatus = Status.Succeeded;
			})
			.addCase(uploadSong.rejected, (state, action) => {
				state.uploadStatus = Status.Failed;
				state.errorMessage = action.payload as string;
			})
			.addCase(fetchUserPlaylist.pending, (state) => {
				state.fetchStatus = Status.Loading;
				state.errorMessage = null;
			})
			.addCase(
				fetchUserPlaylist.fulfilled,
				(state, action: PayloadAction<Song[]>) => {
					state.userPlaylist = action.payload;
					state.fetchStatus = Status.Succeeded;
				}
			)
			.addCase(fetchUserPlaylist.rejected, (state, action) => {
				state.fetchStatus = Status.Failed;
				state.errorMessage = action.payload as string;
			})
			.addCase(deleteSong.pending, (state) => {
				state.deleteStatus = Status.Loading;
				state.errorMessage = null;
			})
			.addCase(deleteSong.fulfilled, (state, action: PayloadAction<string>) => {
				state.userPlaylist = state.userPlaylist.filter(
					(song) => song.id !== action.payload
				);
				state.deleteStatus = Status.Succeeded;
			})
			.addCase(deleteSong.rejected, (state, action) => {
				state.deleteStatus = Status.Failed;
				state.errorMessage = action.payload as string;
			});
	},
});

export const { playNextSong, playPreviousSong, palySong, resetMusicSlice } =
	musicSlice.actions;

export const selectCurrentSong = (state: RootState) => {
	const playlist =
		state.music.activePlaylist === 'system'
			? state.music.systemPlaylist
			: state.music.userPlaylist;
	return playlist.find((song) => song.id === state.music.currentSongId);
};
export const selectActivePlaylist = (state: RootState) =>
	state.music.activePlaylist === 'system'
		? state.music.systemPlaylist
		: state.music.userPlaylist;
const selectSystemPlaylist = (state: RootState) => state.music.systemPlaylist;
const selectUserPlaylist = (state: RootState) => state.music.userPlaylist;
export const selectPlaylistIdsByType = (playlistType: 'system' | 'user') =>
	createSelector(
		[
			(state: RootState) =>
				playlistType === 'system'
					? selectSystemPlaylist(state)
					: selectUserPlaylist(state),
		],
		(playlist: PlaylistItem[]) => playlist.map((song) => song.id)
	);
export const selectUploadStatus = (state: RootState) =>
	state.music.uploadStatus;
export const selectFetchStatus = (state: RootState) => state.music.fetchStatus;
export const selectSongById =
	(playlistType: 'system' | 'user', songId: string) =>
	(state: RootState): Song | SystemSong | undefined => {
		const playlist =
			playlistType === 'system'
				? state.music.systemPlaylist
				: state.music.userPlaylist;
		return playlist.find((song) => song.id === songId);
	};

export default musicSlice.reducer;
