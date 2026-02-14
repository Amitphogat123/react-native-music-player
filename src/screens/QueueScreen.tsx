import { View, Text, Image, TouchableOpacity } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { reorderQueue, removeFromQueue } from "../store/playerSlice";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QueueScreen() {
  const queue = useSelector((state: RootState) => state.player.queue);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{flex:1,backgroundColor:"#121212"}}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Queue
      </Text>

      <DraggableFlatList
        data={queue}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => dispatch(reorderQueue(data))}
        renderItem={({ item, drag, isActive, getIndex }) => (
          <TouchableOpacity
            onLongPress={drag}
            style={{
              flexDirection: "row",
              marginBottom: 15,
              backgroundColor: isActive ? "#ddd" : "#fff",
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 60, height: 60, borderRadius: 10 }}
            />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <Text>{item.artist}</Text>
            </View>

            <TouchableOpacity
              onPress={() => dispatch(removeFromQueue(getIndex()!))}
            >
              <Text style={{ color: "red", fontSize: 18 }}>🗑</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}