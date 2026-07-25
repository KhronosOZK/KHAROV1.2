import { createContext, useContext, useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null=checking, false=guest, obj=user
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("caro_saved") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => setUser(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data);
      return { ok: true };
    } catch (e) { return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message }; }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      setUser(data);
      return { ok: true };
    } catch (e) { return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message }; }
  };

  const logout = async () => { await api.post("/auth/logout").catch(() => {}); setUser(false); };

  const forgotPassword = async (email) => {
    try { await api.post("/auth/forgot-password", { email }); return { ok: true }; }
    catch (e) { return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message }; }
  };

  const resetPassword = async (token, password) => {
    try { await api.post("/auth/reset-password", { token, password }); return { ok: true }; }
    catch (e) { return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message }; }
  };

  const toggleSaved = (id) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("caro_saved", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, forgotPassword, resetPassword, saved, toggleSaved }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
