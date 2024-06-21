import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
// Define a type for the slice state

export interface WindowState {
	id: string;
	zIndex: number;
	position: { x: number; y: number };
	isOpen: boolean;
}

interface WindowsState {
	windows: WindowState[];
}

// Define the initial state using that type
const initialState: WindowsState = {
	windows: [
    {
      id: 'musicPlayer',
      zIndex: 0,
      position: { x: 100, y: 100 },
      isOpen: false,
    },
    {
      id: 'folder',
      zIndex: 0,
      position: { x: 200, y: 200 },
      isOpen: false,
    }
  ]
};

export const windowSlice = createSlice({
	name: 'window',
	initialState,
	reducers: {
		openWindow: (state, action: PayloadAction<{ id: string }>) => {
			const existingWindow = state.windows.find((window) => window.id === action.payload.id);
			const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex));
			if (!existingWindow) {
				state.windows.push({ ...action.payload, zIndex: maxZIndex + 1, position: { x: 100, y: 100 }, isOpen: true });
			} else {
				existingWindow.isOpen = true;
			}
		},
		closeWindow: (state, action: PayloadAction<{ id: string }>) => {
			const existingWindow = state.windows.find((window) => window.id === action.payload.id);
      if(existingWindow){
        existingWindow.isOpen = false;
      }
		},
    moveWindow: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const window = state.windows.find(window => window.id === action.payload.id);
      if (window) {
        window.position = action.payload.position;
      }
    },
	}
});

export const { openWindow, closeWindow, moveWindow } = windowSlice.actions;

export const getWindowById = (id: string) => (state: RootState) => state.window.windows.find((w)=> w.id === id);
export const getWindows= (state: RootState) => state.window.windows;

export default windowSlice.reducer;
