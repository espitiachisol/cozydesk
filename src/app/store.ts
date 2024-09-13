import {
	combineReducers,
	configureStore,
	PayloadAction,
} from '@reduxjs/toolkit';
import windowReducer, {
	initialState as windowInitialState,
} from '../features/window/windowSlice';
import musicReducer, {
	initialState as musicInitialState,
} from '../features/music/musicSlice';
import authReducer, {
	signOut,
	initialState as authInitialState,
} from '../features/auth/authSlice';
import toasterReducer, {
	initialState as toasterInitialState,
} from '../features/toaster/toasterSlice';
import { Status } from '../common/type/type';

const appReducer = combineReducers({
	window: windowReducer,
	music: musicReducer,
	auth: authReducer,
	toaster: toasterReducer,
});
// Root reducer to reset specific slices on sign out
const rootReducer = (
	state: ReturnType<typeof appReducer> | undefined,
	action: PayloadAction<any>
) => {
	if (signOut.fulfilled.match(action)) {
		return {
			window: { ...windowInitialState, status: Status.Idle },
			music: musicInitialState,
			auth: { ...authInitialState, loading: false },
			toaster: state?.toaster || toasterInitialState, // Keep toaster state unchanged
		};
	}
	return appReducer(state, action);
};

export const store = configureStore({
	reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
