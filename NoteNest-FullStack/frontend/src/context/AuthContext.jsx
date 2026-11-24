import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { TOKEN_KEY } from "../services/api";
import * as authService from "../services/authService";
import { readJson, writeJson, removeKey, userKey } from "../services/storage";
import { nameFromEmail } from "../services/format";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const SESSION_KEY = "notenest.session";

// The backend's login response only contains a token (no name or email),
// so the email typed at login - and the name typed at registration - are
// remembered in this browser to show in the interface.
const rememberName = (email, name) => writeJson(userKey("profile", email), { name });
const recallName = (email) => readJson(userKey("profile", email), null)?.name || "";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const s = readJson(SESSION_KEY, null);
    return s?.email ? { email: s.email, name: recallName(s.email) || nameFromEmail(s.email) } : null;
  });
  const [checking, setChecking] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const clearSession = useCallback(() => {
    removeKey(TOKEN_KEY);
    removeKey(SESSION_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // On first load, ask the backend (GET /dashboard) whether the saved token is still valid.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    let cancelled = false;
    authService.verifySession().then((result) => {
      if (cancelled) return;
      if (result === "invalid") clearSession();
      setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const login = async (email, password) => {
    const cleanEmail = email.trim();
    const newToken = await authService.login({ email: cleanEmail, password });
    localStorage.setItem(TOKEN_KEY, newToken);
    writeJson(SESSION_KEY, { email: cleanEmail });
    setToken(newToken);
    setUser({ email: cleanEmail, name: recallName(cleanEmail) || nameFromEmail(cleanEmail) });
  };

  const register = async ({ name, email, password }) => {
    const cleanEmail = email.trim();
    await authService.register({ name: name.trim(), email: cleanEmail, password });
    rememberName(cleanEmail, name.trim());
  };

  const logout = () => clearSession();

  const updateName = (name) => {
    if (!user) return;
    rememberName(user.email, name.trim());
    setUser({ ...user, name: name.trim() || nameFromEmail(user.email) });
  };

  return (
    <AuthContext.Provider
      value={{ token, user, checking, isAuthenticated: Boolean(token && user), login, register, logout, updateName }}
    >
      {children}
    </AuthContext.Provider>
  );
}
