import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mediplain_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("mediplain_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.login({ email, password });
    localStorage.setItem("mediplain_token", data.token);
    setUser(data.user);
    return data;
  }

  async function signup(name, email, password) {
    const data = await api.signup({ name, email, password });
    localStorage.setItem("mediplain_token", data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("mediplain_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
