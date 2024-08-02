import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { WindowInfo } from './type';
import { SYSTEM_WINDOW_ENTRY, SYSTEM_WINDOW_FOLDER, SYSTEM_WINDOW_MUSIC_PLAYER } from './constants';
import { getUserWindows, saveWindowInfoToFirestore } from '../../services/window';
interface WindowsState {
	windows: WindowInfo[];
}

// Define the initial state using that type
export const initialState: WindowsState = {
	windows: [
		{
			id: SYSTEM_WINDOW_ENTRY,
			zIndex: 2,
			position: { x: window.innerWidth / 2 - 265, y: window.innerHeight / 2 - 300 },
			isOpen: true
		},
		{
			id: SYSTEM_WINDOW_MUSIC_PLAYER,
			zIndex: 1,
			position: { x: 100, y: 100 },
			isOpen: false
		},
		{
			id: SYSTEM_WINDOW_FOLDER,
			zIndex: 0,
			position: { x: 200, y: 200 },
			isOpen: false
		}
	]
};

export const fetchUserWindows = createAsyncThunk('windows/fetchUserWindows', async (_, { rejectWithValue }) => {
	const result = await getUserWindows();
	if ('error' in result) return rejectWithValue(result.error);
	return result.response;
});

export const moveWindow = createAsyncThunk(
	'window/moveWindow',
	async (payload: { id: string; position: { x: number; y: number } }, { dispatch, getState, rejectWithValue }) => {
		dispatch(updateWindowPosition(payload));
		const state = getState() as RootState;
		const windowInfo = state.window.windows.find((window) => window.id === payload.id);
		if (!windowInfo) return rejectWithValue('Window not found');
		const updatedWindowInfo = { ...windowInfo, position: payload.position };
		const response = await saveWindowInfoToFirestore(updatedWindowInfo);
		if (response.error) {
			return rejectWithValue(response.error);
		}
		return updatedWindowInfo;
	}
);

export const windowSlice = createSlice({
	name: 'window',
	initialState,
	reducers: {
		openWindow: (state, action: PayloadAction<{ id: string }>) => {
			const existingWindow = state.windows.find((window) => window.id === action.payload.id);
			const windowsIndex = state.windows.map((w) => w.zIndex);
			const maxZIndex = windowsIndex.length > 0 ? Math.max(...windowsIndex) : 0;
			if (!existingWindow) {
				state.windows.push({
					id: action.payload.id,
					zIndex: maxZIndex + 1,
					position: { x: 100, y: 100 },
					isOpen: true
				});
				return;
			}

			if (!existingWindow.isOpen) existingWindow.isOpen = true;
			if (existingWindow.zIndex < maxZIndex) existingWindow.zIndex = maxZIndex + 1;
		},
		closeWindow: (state, action: PayloadAction<{ id: string }>) => {
			const existingWindow = state.windows.find((window) => window.id === action.payload.id);
			if (existingWindow) {
				existingWindow.isOpen = false;
			}
		},
		updateWindowPosition: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
			const window = state.windows.find((window) => window.id === action.payload.id);
			if (window) {
				window.position = action.payload.position;
			}
		},
		bringToFront: (state, action: PayloadAction<{ id: string }>) => {
			const currentWindow = state.windows.find((window) => window.id === action.payload.id);
			if (!currentWindow) return;
			const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex));
			if (currentWindow.zIndex < maxZIndex) {
				currentWindow.zIndex = maxZIndex + 1;
			}
		},
		resetWindowSlice: () => {
			return initialState;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUserWindows.fulfilled, (state, action) => {
			state.windows = action.payload;
		});
	}
});

export const { openWindow, closeWindow, bringToFront, resetWindowSlice, updateWindowPosition } = windowSlice.actions;

export const getWindowById = (id: string) => (state: RootState) => state.window.windows.find((w) => w.id === id);
export const getWindows = (state: RootState) => state.window.windows;

export default windowSlice.reducer;
