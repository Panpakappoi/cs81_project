import React from "react";

const SearchResults = ({
  results,
  onTrackSelect,
  onAlbumSelect,
  onArtistSelect,
}) => {
  console.log("Search Results:", results);

  return (
    <div className="SearchResults">
      {results ? (
        <>
          {results.artists?.items.length > 0 && (
            <>
              <h2>Artists</h2>
              <ul>
                {results.artists.items.map((artist) => (
                  <button
                    className="button"
                    key={artist.id}
                    onClick={() => onArtistSelect(artist)}
                  >
                    {artist.name}
                  </button>
                ))}
              </ul>
            </>
          )}

          {results.albums?.items.length > 0 && (
            <>
              <h2>Albums</h2>
              <ul className="list">
                {results.albums.items.map((album) => (
                  <button
                    className="button"
                    key={album.id}
                    onClick={() => onAlbumSelect(album)}
                  >
                    <img
                      src={album.images[1]?.url}
                      alt={album.name}
                      width={album.images[1]?.width}
                      height={album.images[1]?.height}
                    />
                    {album.name} by{" "}
                    {album.artists.map((artist) => artist.name).join(", ")}
                  </button>
                ))}
              </ul>
            </>
          )}

          {results.tracks?.items.length > 0 && (
            <>
              <h2>Tracks</h2>
              <ul className="list">
                {results.tracks.items.map((track) => (
                  <button
                    className="button"
                    key={track.id}
                    onClick={() => onTrackSelect(track)}
                  >
                    {track.name} by{" "}
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </button>
                ))}
              </ul>
            </>
          )}

          {results.artists?.items.length === 0 &&
            results.albums?.items.length === 0 &&
            results.tracks?.items.length === 0 && <p>No results found.</p>}
        </>
      ) : (
        <p>No search results available.</p>
      )}
    </div>
  );
};

export default SearchResults;
