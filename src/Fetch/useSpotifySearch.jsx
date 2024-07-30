import { useState } from "react";

const useSpotifySearch = (accessToken) => {
  const [results, setResults] = useState({});

  const search = async (query) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=artist,album,track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return { results, search };
};

export default useSpotifySearch;
