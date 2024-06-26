import { configureStore } from '@reduxjs/toolkit'
import windowReducer from '../features/Window/windowSlice'
import musicReducer from '../features/MusicPlayer/musicSlice';


export const store = configureStore({
  reducer: {
    window: windowReducer,
    music: musicReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;