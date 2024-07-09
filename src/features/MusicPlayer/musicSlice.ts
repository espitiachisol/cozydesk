import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { systemPlaylist } from '../../data/music';
import { getUserPlaylist, saveSongToFirestore, uploadSongToStorage } from '../../services/music';
import { Status } from '../../type/common';
import { PlaylistItem, PlaylistType, Song, SystemSong } from '../../type/music';

interface MusicState {
	systemPlaylist: SystemSong[];
	userPlaylist: Song[];
	activePlaylist: PlaylistType;
	currentSongIndex: number;
	uploadStatus: Status;
	fetchStatus: Status;
	errorMessage: string | null;
}

// Define the initial state using that type
const initialState: MusicState = {
	systemPlaylist: systemPlaylist,
	userPlaylist: [],
	activePlaylist: 'system',
	currentSongIndex: 0,
	uploadStatus: 'idle',
	fetchStatus: 'idle',
	errorMessage: null
};

export const fetchUserPlaylist = createAsyncThunk('music/fetchUserPlaylist', async (_, { rejectWithValue }) => {
	try {
		const userPlaylist = await getUserPlaylist();
		return userPlaylist;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

export const uploadSong = createAsyncThunk('music/uploadSong', async ({ file }, { rejectWithValue }) => {
	try {
		const { downloadURL, metadata } = await uploadSongToStorage(file);

		const imageId = `${Math.floor(Math.random() * 6 + 1)}`;
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
			iconURL: `/icons/music-cover-${imageId}.png`
		};
		const savedSong = await saveSongToFirestore(song);
		return savedSong;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

interface PlaySongPayload {
	playlistType: 'system' | 'user';
	songId: string;
}

export const musicSlice = createSlice({
	name: 'music',
	initialState,
	reducers: {
		playNextSong: (state) => {
			const playlist = state.activePlaylist === 'system' ? state.systemPlaylist : state.userPlaylist;
			if (state.currentSongIndex < playlist.length - 1) {
				state.currentSongIndex += 1;
			} else {
				state.currentSongIndex = 0; // Loop back to the start
			}
		},
		playPreviousSong: (state) => {
			const playlist = state.activePlaylist === 'system' ? state.systemPlaylist : state.userPlaylist;
			if (state.currentSongIndex > 0) {
				state.currentSongIndex -= 1;
			} else {
				state.currentSongIndex = playlist.length - 1; // Loop to the end
			}
		},
		palySong(state, action: PayloadAction<PlaySongPayload>) {
			const { playlistType, songId } = action.payload;
			state.activePlaylist = playlistType;
			const playlist = state.activePlaylist === 'system' ? state.systemPlaylist : state.userPlaylist;
			const songIndex = playlist.findIndex((song) => song.id === songId);
			if (songIndex !== -1) state.currentSongIndex = songIndex;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(uploadSong.pending, (state) => {
				state.uploadStatus = 'loading';
				state.errorMessage = null;
			})
			.addCase(uploadSong.fulfilled, (state, action: PayloadAction<Song>) => {
				state.userPlaylist.push(action.payload);
				state.uploadStatus = 'succeeded';
			})
			.addCase(uploadSong.rejected, (state, action) => {
				state.uploadStatus = 'failed';
				state.errorMessage = action.payload as string;
			})
			.addCase(fetchUserPlaylist.pending, (state) => {
				state.fetchStatus = 'loading';
				state.errorMessage = null;
			})
			.addCase(fetchUserPlaylist.fulfilled, (state, action: PayloadAction<Song[]>) => {
				state.userPlaylist = action.payload;
				state.fetchStatus = 'succeeded';
			})
			.addCase(fetchUserPlaylist.rejected, (state, action) => {
				state.fetchStatus = 'failed';
				state.errorMessage = action.payload as string;
			});
	}
});

export const { playNextSong, playPreviousSong, palySong } = musicSlice.actions;

export const selectCurrentSongIndex = (state: RootState) => state.music.currentSongIndex;
export const selectActivePlaylist = (state: RootState) =>
	state.music.activePlaylist === 'system' ? state.music.systemPlaylist : state.music.userPlaylist;
const selectSystemPlaylist = (state: RootState) => state.music.systemPlaylist;
const selectUserPlaylist = (state: RootState) => state.music.userPlaylist;
export const selectPlaylistIdsByType = (playlistType: 'system' | 'user') =>
	createSelector(
		[(state: RootState) => (playlistType === 'system' ? selectSystemPlaylist(state) : selectUserPlaylist(state))],
		(playlist: PlaylistItem[]) => playlist.map((song) => song.id)
	);
export const selectUploadStatus = (state: RootState) => state.music.uploadStatus;
export const selectFetchStatus = (state: RootState) => state.music.fetchStatus;
export const selectSongById =
	(playlistType: 'system' | 'user', songId: string) =>
	(state: RootState): Song | undefined => {
		const playlist = playlistType === 'system' ? state.music.systemPlaylist : state.music.userPlaylist;
		return playlist.find((song) => song.id === songId);
	};

export default musicSlice.reducer;
