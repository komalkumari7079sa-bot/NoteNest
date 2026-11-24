// Small safe wrappers around localStorage (it can throw in private mode).
export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

// Every per-user key is scoped by the account email.
export const userKey = (kind, email) =>
  `notenest.${kind}.${String(email || "").trim().toLowerCase()}`;
