import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { readJson, writeJson, userKey } from "../services/storage";

const DEFAULTS = { view: "grid", sort: "updated", confirmDelete: true };
const PrefsContext = createContext(null);
export const usePrefs = () => useContext(PrefsContext);

export function PrefsProvider({ children }) {
  const { user } = useAuth();
  const email = user?.email;
  const [prefs, setPrefs] = useState(DEFAULTS);

  useEffect(() => {
    setPrefs(email ? { ...DEFAULTS, ...readJson(userKey("prefs", email), {}) } : DEFAULTS);
  }, [email]);

  const setPref = (name, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [name]: value };
      if (email) writeJson(userKey("prefs", email), next);
      return next;
    });
  };

  return <PrefsContext.Provider value={{ prefs, setPref }}>{children}</PrefsContext.Provider>;
}
