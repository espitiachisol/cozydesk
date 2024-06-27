import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../type/user';
import { signUp as signUpService, signIn as signInService } from '../../services/auth';

interface UserState {
	user: User | null;
	loading: boolean;
	error: string | null;
}

const initialState: UserState = {
	user: null,
	loading: false,
	error: null
};

interface Arguments {
	email: string;
	password: string;
}

// Async thunk for user creation
export const signUp = createAsyncThunk<User, Arguments, { rejectValue: string }>(
	'user/signUp',
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const user = await signUpService(email, password);
			return user;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Async thunk for user sign-in
export const signIn = createAsyncThunk<User, Arguments, { rejectValue: string }>(
	'user/signIn',
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const user = await signInService(email, password);
			return user;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// signOut(state) {
		//   state.user = null;
		// },
	},
	extraReducers: (builder) => {
		builder
			.addCase(signUp.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(signUp.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(signIn.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(signIn.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	}
});

// export const { signOut } = userSlice.actions;

export default userSlice.reducer;
