export const searchSongs = async (query: string) => {
  const res = await fetch(
    `https://saavn.sumit.co/api/search/songs?query=${query}`
  );
  const json = await res.json();

  return json.data.results.map((song: any) => ({
    id: song.id,
    name: song.name,
    artist: song.primaryArtists,
    image: song.image[2].link,
    url: song.downloadUrl.find((q: any) => q.quality === "320kbps").link,
    duration: Number(song.duration),
  }));
};