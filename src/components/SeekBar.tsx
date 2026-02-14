import { View} from "react-native";
import Slider from "@react-native-community/slider"
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { seekTo } from "../services/audioService";

export default function SeekBar() {
  const { position, duration } = useSelector(
    (state: RootState) => state.player
  );

  const handleSeek = async (value: number) => {
    await seekTo(value);
  };

  return (
    <View style={{ width: "90%", alignSelf: "center" }}>
      <Slider
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={handleSeek}
      />
    </View>
  );
}