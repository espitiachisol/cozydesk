// src/features/toaster/toasterSlice.ts
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  visible?: boolean;
  showClose?: boolean;
}

interface AddToast {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  visible?: boolean;
  showClose?: boolean;
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
    addToast: (state, action: PayloadAction<AddToast>) => {
      state.toasts.push({...action.payload, visible: true, id: Date.now().toString()});
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    dismissToast: (state, action: PayloadAction<string>) => {
      const toast = state.toasts.find(toast => toast.id === action.payload);
      if (toast) {
        toast.visible = false;
      }
    }
  },
});
const selectToasts = (state: RootState) => state.toaster.toasts;
export const selectToasterIds = createSelector(selectToasts, (toasts) => {
  return toasts.map((t)=> t.id)
})

export const selectToastById = (toastId: string) => (state: RootState) => state.toaster.toasts.find((toast) => toast.id === toastId);


export const { addToast, removeToast, dismissToast } = toasterSlice.actions;
export default toasterSlice.reducer;
