// src/features/toaster/toasterSlice.ts
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

interface ToasterState {
  toasts: Toast[];
}

const initialState: ToasterState = {
  toasts: [],
};

const toasterSlice = createSlice({
  name: 'toaster',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Toast>) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
  },
});
const selectToasts = (state: RootState) => state.toaster.toasts;
export const selectToasterIds = createSelector(selectToasts, (toasts) => {
  return toasts.map((t)=> t.id)
})

export const selectToastById = (toastId: string) => (state: RootState) => state.toaster.toasts.find((toast) => toast.id === toastId);


export const { addToast, removeToast } = toasterSlice.actions;
export default toasterSlice.reducer;
