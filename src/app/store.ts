import { configureStore } from '@reduxjs/toolkit'
import windowReducer from '../features/window/windowSlice'
import musicReducer from '../features/music/musicSlice';
import authReducer from '../features/auth/authSlice';
import toasterReducer from '../features/toaster/toasterSlice';


export const store = configureStore({
  reducer: {
    window: windowReducer,
    music: musicReducer,
    auth: authReducer,
    toaster: toasterReducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;