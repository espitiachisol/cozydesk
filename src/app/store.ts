import { configureStore } from '@reduxjs/toolkit'
import windowReducer from '../features/window/windowSlice'
import musicReducer from '../features/musicPlayer/musicSlice';
import userReducer from '../features/user/UserSlice';


export const store = configureStore({
  reducer: {
    window: windowReducer,
    music: musicReducer,
    user: userReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;