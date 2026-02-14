import { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { searchSongs } from "../api/saavnApi";
import { useDispatch } from "react-redux";
import { setQueue, playSong } from "../store/playerSlice";
import { loadAndPlay } from "../services/audioService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handlePlay = async (song: any, index: number) => {
    dispatch(playSong({ song, index }));
    await loadAndPlay(song.url);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const results = await searchSongs(query);
    setSongs(results);
    dispatch(setQueue(results));
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212", padding: 15 }}>
      
      <TextInput
        placeholder="Search songs..."
        placeholderTextColor="#888"
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

      {loading && (
        <ActivityIndicator size="large" color="#1DB954" />
      )}

      <FlatList
        data={songs}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item, index }: any) => (
          <TouchableOpacity
            onPress={() => handlePlay(item, index)}
            style={{
              flexDirection: "row",
              marginBottom: 15,
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 60, height: 60, borderRadius: 10 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text style={{ color: "gray" }}>
                {item.artist}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
