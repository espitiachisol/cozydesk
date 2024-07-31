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
export const initialState: WindowsState = {
	windows: [
    {
      id: 'signIn',
      zIndex: 2,
      position: { x: window.innerWidth / 2 - 265, y: window.innerHeight / 2 - 300},
      isOpen: true,
    },
    {
      id: 'musicPlayer',
      zIndex: 1,
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
			const currentWindow = state.windows.find((window) => window.id === action.payload.id);
      if(!currentWindow) return;
			const windowsIndex = state.windows.map((w) => w.zIndex);
			const maxZIndex = windowsIndex.length > 0 ? Math.max(...windowsIndex): 0;
      
			if (!currentWindow.isOpen) currentWindow.isOpen = true;
      if (currentWindow.zIndex < maxZIndex) currentWindow.zIndex = maxZIndex + 1;
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
    bringToFront: (state, action: PayloadAction<{ id: string }>) => {
			const currentWindow = state.windows.find(window => window.id === action.payload.id);
      if(!currentWindow) return;
      const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex));
      if (currentWindow.zIndex < maxZIndex) {
        currentWindow.zIndex = maxZIndex + 1;
      }
		},
    resetWindowSlice:() => {
			return initialState
		}
	}
});

export const { openWindow, closeWindow, moveWindow, bringToFront, resetWindowSlice } = windowSlice.actions;

export const getWindowById = (id: string) => (state: RootState) => state.window.windows.find((w)=> w.id === id);
export const getWindows= (state: RootState) => state.window.windows;

export default windowSlice.reducer;
