import React from "react";

const LoginForm = () => {
  const handleLogin = async () => {
    const generateRandomString = (length) => {
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    };

    const codeVerifier = generateRandomString(64);

    const sha256 = async (plain) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return window.crypto.subtle.digest("SHA-256", data);
    };

    const base64encode = (input) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    };

    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const clientId = "046bb321713e4a13b11171629f303e8b";
    const redirectUri = "http://localhost:5173/callback";
    const scope =
      "user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming";

    const authUrl = new URL("https://accounts.spotify.com/authorize");

    // Generate a random state parameter
    const state = generateRandomString(16);

    // Store code verifier and state in local storage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("code_verifier", codeVerifier);
      window.localStorage.setItem("auth_state", state); // Store state for later validation
    }

    const params = {
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
      state, // Include state in the request
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  return (
    <div>
      <button onClick={handleLogin} className="button">
        Login with Spotify
      </button>
    </div>
  );
};

export default LoginForm;
