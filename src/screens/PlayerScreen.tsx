import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  togglePlay,
  playSong,
  playPrev,
  toggleShuffle,
  toggleRepeat,
} from "../store/playerSlice";

import {
  pauseSong,
  resumeSong,
  loadAndPlay,
} from "../services/audioService";

import SeekBar from "../components/SeekBar";

export default function PlayerScreen() {
  const {
    currentSong,
    isPlaying,
    queue,
    currentIndex,
    isShuffle,
    repeatMode,
  } = useSelector((state: RootState) => state.player);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  if (!currentSong) return null;

  // ▶️ Play / Pause
  const toggle = async () => {
    dispatch(togglePlay());
    isPlaying ? await pauseSong() : await resumeSong();
  };

  // ⏭ Next Song (Shuffle + Repeat Supported)
  const nextSong = async () => {
    if (queue.length === 0) return;

    let nextIndex = currentIndex + 1;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    if (nextIndex >= queue.length) {
      if (repeatMode === "all") nextIndex = 0;
      else return;
    }

    const next = queue[nextIndex];

    dispatch(playSong({ song: next, index: nextIndex }));
    await loadAndPlay(next.url);
  };

  // ⏮ Previous Song
  const prevSong = async () => {
    if (currentIndex > 0) {
      const prev = queue[currentIndex - 1];
      dispatch(playSong({ song: prev, index: currentIndex - 1 }));
      await loadAndPlay(prev.url);
    }
  };

  return (
  <SafeAreaView style={{flex:1,backgroundColor:"#121212"}}>
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

      {/* Controls */}
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

      {/* Shuffle + Repeat */}
      <View style={{ flexDirection: "row", gap: 30, marginTop: 20 }}>
        <TouchableOpacity onPress={() => dispatch(toggleShuffle())}>
          <Text style={{ color: isShuffle ? "#1DB954" : "white" }}>
            🔀
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => dispatch(toggleRepeat())}>
          <Text style={{ color: repeatMode !== "off" ? "#1DB954" : "white" }}>
            🔁 {repeatMode}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Open Queue */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Queue" as never)}
        style={{ marginTop: 30 }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          Open Queue
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
