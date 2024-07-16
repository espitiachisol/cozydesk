// src/features/toaster/toasterSlice.ts
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

type ToastType = 'success' | 'error' | 'info' | 'loading';
interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
	visible?: boolean;
	showClose?: boolean;
}

interface AddToast {
	id?: string;
	message: string;
	type: ToastType;
	duration?: number;
	visible?: boolean;
	showClose?: boolean;
}

interface ToasterState {
	toasts: Toast[];
}

const initialState: ToasterState = {
	toasts: []
};

interface UpdateToastMessage {
	id: string;
	message: string;
	type?: ToastType;
}

const toasterSlice = createSlice({
	name: 'toaster',
	initialState,
	reducers: {
		addToast: (state, action: PayloadAction<AddToast>) => {
			const newToast = {
				...action.payload,
				id: Date.now().toString(),
				visible: true
			};
			if (action.payload.id) {
				newToast.id = action.payload.id;
			}
			state.toasts.push(newToast);
		},
		removeToast: (state, action: PayloadAction<string>) => {
			state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
		},
		dismissToast: (state, action: PayloadAction<string>) => {
			const toast = state.toasts.find((toast) => toast.id === action.payload);
			if (toast) {
				toast.visible = false;
			}
		},
		updateToastMessage: (state, action: PayloadAction<UpdateToastMessage>) => {
			const toast = state.toasts.find((toast) => toast.id === action.payload.id);
			if (toast) {
				toast.message = action.payload.message;
				if (action.payload.type) {
					toast.type = action.payload.type;
				}
			}
		}
	}
});
const selectToasts = (state: RootState) => state.toaster.toasts;
export const selectToasterIds = createSelector(selectToasts, (toasts) => {
	return toasts.map((t) => t.id);
});

export const selectToastById = (toastId: string) => (state: RootState) =>
	state.toaster.toasts.find((toast) => toast.id === toastId);

export const { addToast, removeToast, dismissToast, updateToastMessage } = toasterSlice.actions;
export default toasterSlice.reducer;
