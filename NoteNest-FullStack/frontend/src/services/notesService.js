import { readJson, writeJson, userKey } from "./storage";

// IMPORTANT: the original backend has NO notes endpoints (it only provides
// /user/register, /user/login, /home and /dashboard). Notes are therefore
// stored in this browser, separately for each account email.
//
// If your faculty later adds notes routes, only this file needs to change:
// replace each function below with an axios call (src/services/api.js).

const key = (email) => userKey("notes", email);

export function loadNotes(email) {
  const list = readJson(key(email), []);
  return Array.isArray(list) ? list : [];
}

export function saveNotes(email, notes) {
  return writeJson(key(email), notes);
}

export function makeNote({ title = "", content = "", color = "lavender", pinned = false }) {
  const now = new Date().toISOString();
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `n_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    title: title.trim(),
    content,
    color,
    pinned,
    createdAt: now,
    updatedAt: now,
  };
}

export function searchNotes(notes, query) {
  const q = query.trim().toLowerCase();
  if (!q) return notes;
  return notes.filter(
    (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  );
}

export function sortNotes(notes, sortBy) {
  const list = [...notes];
  if (sortBy === "title") {
    // Untitled notes always go last.
    return list.sort((a, b) => {
      if (!a.title && !b.title) return 0;
      if (!a.title) return 1;
      if (!b.title) return -1;
      return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    });
  }
  const field = sortBy === "created" ? "createdAt" : "updatedAt";
  return list.sort((a, b) => b[field].localeCompare(a[field]));
}

export const wordCount = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);

export const NOTE_COLORS = {
  lavender: { label: "Lavender", card: "bg-lav-100 border-lav-200", dot: "bg-lav-300", fold: "bg-lav-200" },
  pink: { label: "Pink", card: "bg-blush-100 border-blush-200", dot: "bg-blush-300", fold: "bg-blush-200" },
  cream: { label: "Cream", card: "bg-cream-100 border-cream-200", dot: "bg-[#F2D7A8]", fold: "bg-cream-200" },
  blue: { label: "Blue", card: "bg-sky-100 border-sky-200", dot: "bg-sky-300", fold: "bg-sky-200" },
};
