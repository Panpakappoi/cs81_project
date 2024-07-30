import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import SearchResults from "../Fetch/SearchResults";

const SplashPage = () => {
  const [userData, setUserData] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login"); // Redirect to login if no access token
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user profile
        const userResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        setUserData(userData);

        // Fetch top artists
        const artistsResponse = await fetch(
          "https://api.spotify.com/v1/me/top/artists?limit=10",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!artistsResponse.ok) throw new Error("Failed to fetch top artists");
        const artistsData = await artistsResponse.json();
        setTopArtists(artistsData.items);

        // Fetch top tracks
        const tracksResponse = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=10",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!tracksResponse.ok) throw new Error("Failed to fetch top tracks");
        const tracksData = await tracksResponse.json();
        setTopTracks(tracksData.items);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [accessToken, navigate]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=artist,track,album&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch search results");
      const data = await response.json();
      setSearchResults({
        artists: data.artists,
        albums: data.albums,
        tracks: data.tracks,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    const trackEmbedUrl = `https://open.spotify.com/embed/track/${track.id}`;
    document.getElementById("spotify-player").src = trackEmbedUrl;
  };

  const handleAlbumSelect = (album) => {
    setCurrentTrack(null); // Clear current track
    const albumEmbedUrl = `https://open.spotify.com/embed/album/${album.id}`;
    document.getElementById("spotify-player").src = albumEmbedUrl;
  };

  const handleArtistSelect = (artist) => {
    setCurrentTrack(null); // Clear current track
    const artistEmbedUrl = `https://open.spotify.com/embed/artist/${artist.id}`;
    document.getElementById("spotify-player").src = artistEmbedUrl;
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2 className="playback-header">Playback Area</h2>
        <div className="gradient"></div>
        {currentTrack ? (
          <div>
            <p>
              Now Playing: {currentTrack.name} by{" "}
              {currentTrack.artists.map((artist) => artist.name).join(", ")}
            </p>
            <iframe
              id="spotify-player"
              src={`https://open.spotify.com/embed/track/${currentTrack.id}`}
              width="100%"
              height="380"
              frameBorder="0"
              allow="encrypted-media"
              title="Spotify Playback"
            ></iframe>
          </div>
        ) : (
          <iframe
            id="spotify-player"
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
            width="100%"
            height="380"
            frameBorder="0"
            allow="encrypted-media"
            title="Spotify Playback"
          ></iframe>
        )}
      </div>
      <div className="main-content">
        <h1 className="name">Welcome, {userData?.display_name || "User"}!</h1>
        <div className="gradient"></div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        <div>
          <h2>Your Top Artists</h2>
          <ul>
            {topArtists.length > 0
              ? topArtists.map((artist) => (
                  <li className="list" key={artist.id}>
                    <img
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      width={50}
                      height={50}
                    />
                    {artist.name}
                  </li>
                ))
              : "Loading..."}
          </ul>
        </div>

        <div>
          <h2>Your Top Tracks</h2>
          <ul>
            {topTracks.length > 0
              ? topTracks.map((track) => (
                  <li className="list" key={track.id}>
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      width={50}
                      height={50}
                      style={{ marginRight: "10px" }}
                    />
                    {track.name} by{" "}
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </li>
                ))
              : "Loading..."}
          </ul>
        </div>

        <div>
          <h3>Search</h3>
          <SearchBar onSearch={handleSearch} />
          <div>
            {searchResults && (
              <div>
                <div className="gradient"></div>
                <h4>Search Results:</h4>
                <SearchResults
                  results={searchResults}
                  onTrackSelect={handleTrackSelect}
                  onAlbumSelect={handleAlbumSelect}
                  onArtistSelect={handleArtistSelect}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
