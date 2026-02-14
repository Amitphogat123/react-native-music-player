import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Song {
  id: string;
  name: string;
  artist: string;
  image: string;
  url: string;
  duration: number;
}

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  position: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: "off" | "one" | "all";
}

const saveQueueToStorage = async (queue: Song[]) => {
  await AsyncStorage.setItem("queue", JSON.stringify(queue));
};

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  position: 0,
  duration: 0,
  isShuffle: false,
  repeatMode: "off",
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setQueue(state, action: PayloadAction<Song[]>) {
      state.queue = action.payload;
      saveQueueToStorage(action.payload);
    },
    playSong(state, action: PayloadAction<{ song: Song; index: number }>) {
      state.currentSong = action.payload.song;
      state.currentIndex = action.payload.index;
      state.isPlaying = true;
    },
    togglePlay(state) {
      state.isPlaying = !state.isPlaying;
    },
    setPosition(state, action: PayloadAction<number>) {
      state.position = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    playNext(state) {
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex++;
        state.currentSong = state.queue[state.currentIndex];
      }
    },
    playPrev(state) {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        state.currentSong = state.queue[state.currentIndex];
      }
    },
    reorderQueue(state, action: PayloadAction<Song[]>) {
      state.queue = action.payload;
      saveQueueToStorage(action.payload);
    },
    removeFromQueue(state, action: PayloadAction<number>) {
      state.queue.splice(action.payload, 1);
      saveQueueToStorage(state.queue);
    },
    toggleShuffle(state) {
      state.isShuffle = !state.isShuffle;
    },
    toggleRepeat(state) {
      if (state.repeatMode === "off") state.repeatMode = "all";
      else if (state.repeatMode === "all") state.repeatMode = "one";
      else state.repeatMode = "off";
    },
  },
});

export const {
  setQueue,
  playSong,
  togglePlay,
  setPosition,
  setDuration,
  playNext,
  playPrev,
  reorderQueue,
  removeFromQueue,
  toggleShuffle,
  toggleRepeat,
} = playerSlice.actions;

export default playerSlice.reducer;