import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  togglePlay,
  playNext,
  playPrev,
} from "../store/playerSlice";
import {
  pauseSong,
  resumeSong,
  loadAndPlay,
} from "../services/audioService";
import SeekBar from "../components/SeekBar";

export default function PlayerScreen() {
  const { currentSong, isPlaying, queue, currentIndex } = useSelector(
    (state: RootState) => state.player
  );

  const dispatch = useDispatch();

  if (!currentSong) return null;

  const toggle = async () => {
    dispatch(togglePlay());
    isPlaying ? await pauseSong() : await resumeSong();
  };

  const nextSong = async () => {
    if (currentIndex < queue.length - 1) {
      const next = queue[currentIndex + 1];
      dispatch(playNext());
      await loadAndPlay(next.url);
    }
  };

  const prevSong = async () => {
    if (currentIndex > 0) {
      const prev = queue[currentIndex - 1];
      dispatch(playPrev());
      await loadAndPlay(prev.url);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#121212",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={{ uri: currentSong.image }}
        style={{ width: 300, height: 300, borderRadius: 20 }}
      />

      <Text style={{ color: "white", fontSize: 22, marginTop: 20 }}>
        {currentSong.name}
      </Text>
      <Text style={{ color: "gray", marginBottom: 20 }}>
        {currentSong.artist}
      </Text>

      <SeekBar />

      <View
        style={{
          flexDirection: "row",
          marginTop: 30,
          gap: 40,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={prevSong}>
          <Text style={{ color: "white", fontSize: 30 }}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggle}>
          <Text style={{ color: "white", fontSize: 40 }}>
            {isPlaying ? "⏸" : "▶️"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={nextSong}>
          <Text style={{ color: "white", fontSize: 30 }}>⏭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}