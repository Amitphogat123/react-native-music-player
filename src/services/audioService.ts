import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export const loadAndPlay = async (url: string) => {
  if (sound) {
    await sound.unloadAsync();
  }

  const { sound: newSound } = await Audio.Sound.createAsync(
    { uri: url },
    { shouldPlay: true }
  );

  sound = newSound;
};

export const pauseSong = async () => {
  await sound?.pauseAsync();
};

export const resumeSong = async () => {
  await sound?.playAsync();
};

export const seekTo = async (position: number) => {
  await sound?.setPositionAsync(position);
};