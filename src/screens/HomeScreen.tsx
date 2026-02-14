import { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { searchSongs } from "../api/saavnApi";
import { useDispatch } from "react-redux";
import { setQueue, playSong } from "../store/playerSlice";
import { loadAndPlay } from "../services/audioService";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const dispatch = useDispatch();

  const handleSearch = async () => {
    const results = await searchSongs(query);
    setSongs(results);
    dispatch(setQueue(results));
  };

  const handlePlay = async (song: any, index: number) => {
    dispatch(playSong({ song, index }));
    await loadAndPlay(song.url);
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <TextInput
        placeholder="Search songs..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        style={{
          backgroundColor: "#eee",
          padding: 12,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <FlatList
        data={songs}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item, index }: any) => (
          <TouchableOpacity
            onPress={() => handlePlay(item, index)}
            style={{ flexDirection: "row", marginBottom: 15 }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 60, height: 60, borderRadius: 10 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <Text>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}