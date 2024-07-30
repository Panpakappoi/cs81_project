import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokens = async (code) => {
      const codeVerifier = localStorage.getItem("code_verifier");
      const clientId = "046bb321713e4a13b11171629f303e8b";
      const clientSecret = "76cfb3ac45094762bcab88c77775180c"; // Ensure this is correct
      const redirectUri = "http://localhost:5173/callback";
      const url = "https://accounts.spotify.com/api/token";

      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      };

      try {
        const response = await fetch(url, payload);
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          navigate("/splash"); // Redirect to the splash page
        } else {
          console.error("Error fetching tokens:", data);
          alert(
            `Error fetching tokens: ${
              data.error_description || "Unknown error"
            }`
          ); // Display a user-friendly message
          navigate("/login"); // Redirect to login on error
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
        alert(`Error fetching tokens: ${error.message}`); // Display a user-friendly message
        navigate("/login");
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchTokens(code);
    }
  }, [navigate]);

  return <div>Processing...</div>;
};

export default Callback;
