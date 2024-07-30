import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/LoginForm";
import Callback from "./Components/Callback";
import SplashPage from "./Components/SplashPage";
import SearchBar from "./Components/SearchBar";
import PrivateRoute from "./Components/PrivateRoute";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("access_token");
      // Implement token validation logic, for example:
      // - Check token expiration
      // - Optionally make an API call to validate the token

      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    // Optionally render a loading spinner or nothing until authentication check is done
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/splash" : "/login"} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/splash" element={<PrivateRoute component={SplashPage} />} />
      <Route path="/search" element={<SearchBar />} />
    </Routes>
  );
};
export default App;
