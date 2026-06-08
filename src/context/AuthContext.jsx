// src/context/AuthContext.js

import { createContext, useContext, useEffect, useState } from "react";
import { setToken } from "../comman/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 page refresh pe token wapas lao
 useEffect(() => {
  const refresh = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/admin/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      console.log("✅ refresh success", data);

      setToken(data.accessToken);
      setIsAuth(true);

    } catch (err) {
      console.log("❌ refresh failed");

      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  refresh();
}, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);