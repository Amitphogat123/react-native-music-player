import { Provider } from "react-redux";
import { store } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { useEffect } from "react";
import { Audio } from "expo-av";
import { useDispatch } from "react-redux";
import { setQueue } from "./src/store/playerSlice";
import { loadQueueFromStorage } from "./src/store/playerSlice";

export default function App() {
 const dispatch = useDispatch();

  useEffect(() => {
    const loadQueue = async () => {
      const savedQueue = await loadQueueFromStorage();
      dispatch(setQueue(savedQueue));
    };
    loadQueue();
  }, []);

  useEffect(() => {
  Audio.setAudioModeAsync({
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
}, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
