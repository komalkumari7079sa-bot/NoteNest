import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { loadNotes, saveNotes, makeNote } from "../services/notesService";

const NotesContext = createContext(null);
export const useNotes = () => useContext(NotesContext);

export function NotesProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const email = user?.email;
  const [notes, setNotes] = useState([]);
  const [editor, setEditor] = useState({ open: false, note: null });

  useEffect(() => {
    setNotes(email ? loadNotes(email) : []);
  }, [email]);

  // Applies a change and persists it for the signed-in account.
  const commit = useCallback(
    (updater) => {
      setNotes((prev) => {
        const next = updater(prev);
        if (email && !saveNotes(email, next)) {
          toast.error("Could not save: browser storage is full or blocked.");
        }
        return next;
      });
    },
    [email, toast]
  );

  const createNote = (data) => {
    const note = makeNote(data);
    commit((prev) => [note, ...prev]);
    return note;
  };

  const updateNote = (id, patch) =>
    commit((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n))
    );

  // Pinning does not count as an edit, so "updatedAt" is left alone.
  const togglePin = (id) =>
    commit((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const deleteNote = (id) => commit((prev) => prev.filter((n) => n.id !== id));
  const clearAll = () => commit(() => []);

  const openEditor = (note = null) => setEditor({ open: true, note });
  const closeEditor = () => setEditor({ open: false, note: null });

  return (
    <NotesContext.Provider
      value={{ notes, createNote, updateNote, togglePin, deleteNote, clearAll, editor, openEditor, closeEditor }}
    >
      {children}
    </NotesContext.Provider>
  );
}
