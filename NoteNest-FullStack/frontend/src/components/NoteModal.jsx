import { useEffect, useRef, useState } from "react";
import { X, Pin, Check } from "lucide-react";
import { NOTE_COLORS, wordCount } from "../services/notesService";
import { useNotes } from "../context/NotesContext";
import { useToast } from "../context/ToastContext";

// One dialog for both creating and editing a note.
export default function NoteModal() {
  const { editor, closeEditor, createNote, updateNote } = useNotes();
  const toast = useToast();
  const editing = editor.note;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("lavender");
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    if (!editor.open) return;
    setTitle(editing?.title || "");
    setContent(editing?.content || "");
    setColor(editing?.color || "lavender");
    setPinned(editing?.pinned || false);
    setError("");
    const t = setTimeout(() => titleRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [editor.open, editing]);

  const save = () => {
    if (!title.trim() && !content.trim()) {
      setError("Write a title or some text before saving.");
      return;
    }
    if (editing) {
      updateNote(editing.id, { title: title.trim(), content, color, pinned });
      toast.success("Note updated");
    } else {
      createNote({ title, content, color, pinned });
      toast.success("Note created");
    }
    closeEditor();
  };

  useEffect(() => {
    if (!editor.open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeEditor();
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") save();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!editor.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 animate-fade-in sm:items-center sm:p-4" onClick={closeEditor}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-modal-title"
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[94vh] w-full max-w-xl animate-pop-in flex-col rounded-t-[2rem] border p-5 shadow-lift sm:rounded-[2rem] sm:p-7 ${NOTE_COLORS[color].card}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="note-modal-title" className="text-xl font-bold">{editing ? "Edit note" : "New note"}</h2>
          <button onClick={closeEditor} aria-label="Close" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-white/70">
            <X size={20} />
          </button>
        </div>

        <label htmlFor="note-title" className="sr-only">Title</label>
        <input
          id="note-title"
          ref={titleRef}
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(""); }}
          placeholder="Title"
          maxLength={120}
          className="w-full bg-transparent font-display text-2xl font-bold text-ink placeholder:text-ink-mute/70 focus:outline-none"
        />
        <label htmlFor="note-content" className="sr-only">Note text</label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => { setContent(e.target.value); setError(""); }}
          placeholder="Start writing..."
          rows={9}
          className="mt-3 min-h-[180px] w-full flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-ink placeholder:text-ink-mute/70 focus:outline-none"
        />

        {error && <p className="mb-2 text-sm font-bold text-blush-600" role="alert">{error}</p>}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/70 pt-4">
          <div className="flex items-center gap-2" role="radiogroup" aria-label="Note colour">
            {Object.entries(NOTE_COLORS).map(([key, c]) => (
              <button
                key={key}
                role="radio"
                aria-checked={color === key}
                aria-label={c.label}
                title={c.label}
                onClick={() => setColor(key)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${c.dot} ${
                  color === key ? "border-ink" : "border-white"
                }`}
              >
                {color === key && <Check size={15} className="text-ink" />}
              </button>
            ))}
            <button
              onClick={() => setPinned((p) => !p)}
              aria-pressed={pinned}
              className={`ml-2 inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3.5 text-sm font-bold transition ${
                pinned ? "bg-white text-lav-700 shadow-soft" : "text-ink-soft hover:bg-white/70"
              }`}
            >
              <Pin size={15} fill={pinned ? "currentColor" : "none"} /> {pinned ? "Pinned" : "Pin"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-ink-mute sm:inline">{wordCount(content)} words</span>
            <button className="btn-primary" onClick={save}>{editing ? "Save changes" : "Create note"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
