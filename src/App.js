import React, { useState } from "react";
import Routes from "./routes";
import { AuthContext } from "./contexts/auth";
import "./App.css";

function App() {
  const existingTokens = localStorage.getItem("tokens");
  const existingRole = localStorage.getItem("role");
  const existingId = localStorage.getItem("id");
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const [role, setRole] = useState(existingRole);
  const [id, setId] = useState(existingId);

  const setTokens = (data) => {
    localStorage.setItem("tokens", data);
    setAuthTokens(data);
  };

  const setRoles = (data) => {
    localStorage.setItem("role", data);
    setRole(data);
  };

  const setUserId = (data) => {
    localStorage.setItem("id", data);
    setId(data);
  };

  const logout = () => {
    localStorage.clear();
    setAuthTokens(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        setAuthTokens: setTokens,
        setRole: setRoles,
        role,
        logout,
        setId: setUserId,
        id,
      }}
    >
      <Routes />
    </AuthContext.Provider>
  );
}

export default App;
