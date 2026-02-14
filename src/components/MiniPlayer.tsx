import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { togglePlay } from "../store/playerSlice";
import { pauseSong, resumeSong } from "../services/audioService";
import { useNavigation } from "@react-navigation/native";

export default function MiniPlayer() {
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  if (!currentSong) return null;

  const toggle = async () => {
    dispatch(togglePlay());
    isPlaying ? await pauseSong() : await resumeSong();
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Player" as never)}
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#111",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: currentSong.image }}
        style={{ width: 50, height: 50, borderRadius: 10 }}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ color: "white" }}>{currentSong.name}</Text>
        <Text style={{ color: "gray" }}>{currentSong.artist}</Text>
      </View>

      <TouchableOpacity onPress={toggle}>
        <Text style={{ color: "white", fontSize: 18 }}>
          {isPlaying ? "⏸" : "▶️"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}