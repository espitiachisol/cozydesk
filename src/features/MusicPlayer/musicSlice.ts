import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { systemMusics } from '../../data/music';

interface Song{
  id: string;
  title: string;
  src: string;
  img: string;
  icon: string;
}

interface MusicState {
  playlist: Song[];
  currentSongIndex: number;
}

// Define the initial state using that type
const initialState: MusicState = {
  playlist: systemMusics,
  currentSongIndex: 0,
};

export const musicSlice = createSlice({
	name: 'music',
	initialState,
	reducers: {
    setPlaylist(state, action: PayloadAction<string>) {
      const key = action.payload;
      if(key === 'systemMusic') state.playlist = systemMusics;
       // Reset to the first song
      state.currentSongIndex = 0;
    },
    nextSong: (state)  =>{
      if (state.currentSongIndex < state.playlist.length - 1) {
        state.currentSongIndex += 1;
      } else {
        state.currentSongIndex = 0; // Loop back to the start
      }

    },
    previousSong: (state) => {
      if (state.currentSongIndex > 0) {
        state.currentSongIndex -= 1;
      } else {
        state.currentSongIndex = state.playlist.length - 1; // Loop to the end
      }

    },
    setSong(state, action: PayloadAction<string>){
      const id = action.payload;
      const index = state.playlist.findIndex((song)=>song.id === id)
      if(index!==state.currentSongIndex) state.currentSongIndex = index;
    }
	}
});

export const { setPlaylist, nextSong, previousSong, setSong } = musicSlice.actions;

export const getCurrentSongIndex= (state: RootState) => state.music.currentSongIndex;
export const getPlayList= (state: RootState) => state.music.playlist;


export default musicSlice.reducer;
