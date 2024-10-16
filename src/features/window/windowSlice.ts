import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { WindowInfo } from './type';
import windowService from '../../services/window';
import { Status } from '../../common/type/type';
import debounce from '../../utils/debounce';
import { windowConfigs } from './windowConfigs';
import { SYSTEM_WINDOW_ENTRY } from './constants';
interface WindowsState {
	windows: WindowInfo[];
	status: Status;
}

// Define the initial state using that type
export const initialState: WindowsState = {
	windows: [
		{
			id: SYSTEM_WINDOW_ENTRY,
			zIndex: 0,
			position: {
				x: window.innerWidth / 2 - 130,
				y: window.innerHeight / 2 - 260,
			},
			size: {
				width: windowConfigs[SYSTEM_WINDOW_ENTRY].width,
				height: windowConfigs[SYSTEM_WINDOW_ENTRY].height,
			},
			isOpen: true,
		},
	],
	status: Status.Loading,
};

export const fetchUserWindows = createAsyncThunk(
	'windows/fetchUserWindows',
	async (_, { rejectWithValue }) => {
		const result = await windowService.getWindows();
		if ('error' in result) return rejectWithValue(result.error);
		return result.response;
	}
);

const debounceUpdateWindow = debounce(windowService.updateWindow, 3000);

export const resizeWindow = createAsyncThunk(
	'window/resizeWindow',
	async (
		payload: { id: string; size: { width: number; height: number } },
		{ dispatch, getState, rejectWithValue }
	) => {
		dispatch(updateWindowSize(payload));
		const state = getState() as RootState;
		const windowInfo = state.window.windows.find(
			(window) => window.id === payload.id
		);
		if (!windowInfo) return rejectWithValue('Window not found');
		debounceUpdateWindow(payload.id, {
			size: payload.size,
			zIndex: windowInfo.zIndex,
		});
	}
);

export const closeWindowAsync = createAsyncThunk(
	'window/closeWindow',
	async (payload: { id: string }, { dispatch, rejectWithValue }) => {
		dispatch(closeWindow(payload));
		const result = await windowService.closeWindow(payload.id);
		if ('error' in result) {
			return rejectWithValue(result.error);
		}
	}
);

export const openWindowAsync = createAsyncThunk(
	'window/openWindow',
	async (payload: { id: string }, { dispatch, getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const { windows } = state.window;
		const existingWindow = windows.find((window) => window.id === payload.id);
		const maxZIndex = getMaxZIndex(windows);
		const nextZIndex = maxZIndex + 1;
		let result;
		if (!existingWindow) {
			const newWindow = {
				id: payload.id,
				zIndex: nextZIndex,
				position: {
					x: window.innerWidth / 2 - windowConfigs[payload.id].width / 2,
					y: window.innerHeight / 2 - windowConfigs[payload.id].height / 2,
				},
				size: {
					width: windowConfigs[payload.id].width,
					height: windowConfigs[payload.id].height,
				},
				isOpen: true,
			};
			dispatch(openNewWindow(newWindow));
			result = await windowService.createWindow(newWindow);
		} else {
			dispatch(openWindow({ id: payload.id, nextZIndex }));
			result = await windowService.updateWindow(payload.id, {
				zIndex: nextZIndex,
				isOpen: true,
			});
		}
		if ('error' in result) {
			return rejectWithValue(result.error);
		}
	}
);

export const moveWindow = createAsyncThunk(
	'window/moveWindow',
	async (
		payload: { id: string; position: { x: number; y: number } },
		{ dispatch, getState, rejectWithValue }
	) => {
		dispatch(updateWindowPosition(payload));
		const state = getState() as RootState;
		const windowInfo = state.window.windows.find(
			(window) => window.id === payload.id
		);
		if (!windowInfo) return rejectWithValue('Window not found');
		debounceUpdateWindow(payload.id, {
			position: payload.position,
			zIndex: windowInfo.zIndex,
		});
	}
);

const getMaxZIndex = (windows: WindowInfo[]) => {
	return windows.length > 0 ? Math.max(...windows.map((w) => w.zIndex)) : 0;
};

export const windowSlice = createSlice({
	name: 'window',
	initialState,
	reducers: {
		openNewWindow: (state, action: PayloadAction<WindowInfo>) => {
			state.windows.push(action.payload);
		},
		openWindow: (
			state,
			action: PayloadAction<{ id: string; nextZIndex: number }>
		) => {
			const existingWindow = state.windows.find(
				(window) => window.id === action.payload.id
			);
			if (existingWindow) {
				existingWindow.isOpen = true;
				existingWindow.zIndex = action.payload.nextZIndex;
			}
		},
		closeWindow: (state, action: PayloadAction<{ id: string }>) => {
			const existingWindow = state.windows.find(
				(window) => window.id === action.payload.id
			);
			if (existingWindow) {
				existingWindow.isOpen = false;
				existingWindow.zIndex = 0;
			}
		},
		updateWindowPosition: (
			state,
			action: PayloadAction<{ id: string; position: { x: number; y: number } }>
		) => {
			const window = state.windows.find(
				(window) => window.id === action.payload.id
			);
			if (window) {
				window.position = action.payload.position;
			}
		},
		updateWindowSize: (
			state,
			action: PayloadAction<{
				id: string;
				size: { width: number; height: number };
			}>
		) => {
			const window = state.windows.find(
				(window) => window.id === action.payload.id
			);
			if (window) {
				window.size = action.payload.size;
			}
		},
		bringToFront: (state, action: PayloadAction<{ id: string }>) => {
			const currentWindow = state.windows.find(
				(window) => window.id === action.payload.id
			);
			if (!currentWindow) return;
			const maxZIndex = getMaxZIndex(state.windows);
			if (currentWindow.zIndex < maxZIndex) {
				currentWindow.zIndex = maxZIndex + 1;
			}
		},
		resetStatusToIdle: (state) => {
			state.status = Status.Idle;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUserWindows.pending, (state) => {
			state.status = Status.Loading;
		}),
			builder.addCase(fetchUserWindows.fulfilled, (state, action) => {
				state.windows = action.payload;
				state.status = Status.Succeeded;
			});
	},
});

export const { bringToFront, resetStatusToIdle, updateWindowPosition } =
	windowSlice.actions;

const { closeWindow, openNewWindow, openWindow, updateWindowSize } =
	windowSlice.actions;

export const getWindowById = (id: string) => (state: RootState) =>
	state.window.windows.find((w) => w.id === id);
export const getWindows = (state: RootState) => state.window.windows;
export const selectWindowsStatus = (state: RootState) => state.window.status;

export default windowSlice.reducer;
