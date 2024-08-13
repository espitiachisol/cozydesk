import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from './type';
import {
	signUpService,
	signInService,
	signOutService,
} from '../../services/auth';
import { RootState } from '../../app/store';
import { addToast } from '../toaster/toasterSlice';
import { Status } from '../../common/type/type';
import { fetchUserWindows, openWindow } from '../window/windowSlice';
import { SYSTEM_WINDOW_ENTRY } from '../window/constants';

interface UserState {
	user: User | null;
	status: Status;
	errorMessage: string | null;
}

export const initialState: UserState = {
	user: null,
	status: Status.Idle,
	errorMessage: null,
};

interface Arguments {
	email: string;
	password: string;
}

// Async thunk for user creation
export const signUp = createAsyncThunk<
	User,
	Arguments,
	{ rejectValue: string }
>('auth/signUp', async ({ email, password }, { rejectWithValue, dispatch }) => {
	const result = await signUpService(email, password);
	if ('error' in result) {
		dispatch(addToast({ message: result.error, type: 'error' }));
		return rejectWithValue(result.error);
	}
	dispatch(
		addToast({ message: 'Sign up successful', type: 'success', duration: 3000 })
	);
	dispatch(openWindow({ id: SYSTEM_WINDOW_ENTRY }));
	return result.response;
});

// Async thunk for user sign-in
export const signIn = createAsyncThunk<
	User,
	Arguments,
	{ rejectValue: string }
>('auth/signIn', async ({ email, password }, { rejectWithValue, dispatch }) => {
	const result = await signInService(email, password);
	if ('error' in result) {
		dispatch(addToast({ message: result.error, type: 'error' }));
		return rejectWithValue(result.error);
	}
	dispatch(
		addToast({ message: 'Sign in successful', type: 'success', duration: 3000 })
	);
	dispatch(fetchUserWindows());
	return result.response;
});

export const signOut = createAsyncThunk(
	'auth/signOut',
	async (res, { rejectWithValue, dispatch }) => {
		const result = await signOutService();
		if ('error' in result) {
			dispatch(addToast({ message: result.error, type: 'error' }));
			return rejectWithValue(result.error);
		}
		dispatch(
			addToast({
				message: 'Sign out successful',
				type: 'success',
				duration: 3000,
			})
		);
		return result.response;
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError(state) {
			state.errorMessage = null;
		},
		userSignedIn(state, action: PayloadAction<User>) {
			state.user = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(signUp.pending, (state) => {
				state.status = Status.Loading;
				state.errorMessage = null;
			})
			.addCase(signUp.fulfilled, (state) => {
				state.status = Status.Succeeded;
			})
			.addCase(signUp.rejected, (state, action) => {
				state.status = Status.Failed;
				state.errorMessage = action.payload || '';
			})
			.addCase(signIn.pending, (state) => {
				state.status = Status.Loading;
				state.errorMessage = null;
			})
			.addCase(signIn.fulfilled, (state) => {
				state.status = Status.Succeeded;
			})
			.addCase(signIn.rejected, (state, action) => {
				state.status = Status.Failed;
				state.errorMessage = action.payload || '';
			})
			.addCase(signOut.pending, (state) => {
				state.status = Status.Loading;
				state.errorMessage = null;
			})
			.addCase(signOut.fulfilled, () => {
				// This case can be deleted since rootReducer handles the reset
			})
			.addCase(signOut.rejected, (state, action) => {
				state.status = Status.Failed;
				state.errorMessage = action.payload || '';
			});
	},
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthErrorMessage = (state: RootState) =>
	state.auth.errorMessage;
export const { clearError, userSignedIn } = authSlice.actions;

export default authSlice.reducer;
