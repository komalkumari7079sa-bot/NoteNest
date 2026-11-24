import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pin, StickyNote, ArrowRight, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NotesContext";
import { usePrefs } from "../context/PrefsContext";
import { useToast } from "../context/ToastContext";
import NoteCard from "../components/NoteCard";
import ConfirmDialog from "../components/ConfirmDialog";
import ConnectionBadge from "../components/ConnectionBadge";
import LocalNotesNotice from "../components/LocalNotesNotice";
import EmptyState from "../components/EmptyState";
import { greeting, isToday, nameFromEmail } from "../services/format";
import { sortNotes, wordCount } from "../services/notesService";

export default function Dashboard() {
  const { user } = useAuth();
  const { notes, createNote, togglePin, deleteNote, openEditor } = useNotes();
  const { prefs } = usePrefs();
  const toast = useToast();
  const [quickTitle, setQuickTitle] = useState("");
  const [quickText, setQuickText] = useState("");
  const [toDelete, setToDelete] = useState(null);

  const firstName = (user?.name || nameFromEmail(user?.email)).split(" ")[0];
  const pinned = sortNotes(notes.filter((n) => n.pinned), "updated");
  const recent = sortNotes(notes, "updated").slice(0, 6);
  const editedToday = notes.filter((n) => isToday(n.updatedAt)).length;
  const words = notes.reduce((sum, n) => sum + wordCount(n.content), 0);

  const quickSave = (e) => {
    e.preventDefault();
    if (!quickTitle.trim() && !quickText.trim()) return;
    createNote({ title: quickTitle, content: quickText });
    setQuickTitle("");
    setQuickText("");
    toast.success("Note created");
  };

  const requestDelete = (note) => {
    if (prefs.confirmDelete) setToDelete(note);
    else {
      deleteNote(note.id);
      toast.success("Note deleted");
    }
  };

  const stats = [
    { label: "Notes", value: notes.length },
    { label: "Pinned", value: pinned.length },
    { label: "Edited today", value: editedToday },
    { label: "Words written", value: words.toLocaleString() },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{greeting()}, {firstName}</h1>
          <p className="mt-1.5 text-ink-soft">Here is what's in your nest today.</p>
        </div>
        <ConnectionBadge />
      </header>

      <section aria-label="Summary" className="grid grid-cols-2 divide-lav-100 rounded-3xl border border-lav-100 bg-white shadow-soft sm:grid-cols-4 sm:divide-x">
        {stats.map((s, i) => (
          <div key={s.label} className={`px-6 py-5 ${i > 1 ? "border-t border-lav-100 sm:border-t-0" : ""} ${i % 2 === 1 ? "border-l border-lav-100 sm:border-l-0" : ""}`}>
            <p className="font-display text-3xl font-bold">{s.value}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{s.label}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="quick-title">
        <h2 id="quick-title" className="sr-only">Quick note</h2>
        <form onSubmit={quickSave} className="rounded-3xl border border-lav-200 bg-lav-100 p-5 shadow-soft">
          <label htmlFor="quick-title-input" className="sr-only">Title</label>
          <input
            id="quick-title-input"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Jot something down..."
            maxLength={120}
            className="w-full bg-transparent font-display text-xl font-bold placeholder:text-ink-mute focus:outline-none"
          />
          <label htmlFor="quick-text-input" className="sr-only">Note text</label>
          <textarea
            id="quick-text-input"
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            placeholder="Add the details here"
            rows={2}
            className="mt-1 w-full resize-none bg-transparent text-[15px] placeholder:text-ink-mute focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button type="submit" className="btn-primary" disabled={!quickTitle.trim() && !quickText.trim()}>
              <Check size={17} /> Save note
            </button>
          </div>
        </form>
      </section>

      {notes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="Your nest is empty"
          text="Write your first note above, or open the full editor to pick a colour and pin it."
          action={<button className="btn-primary" onClick={() => openEditor()}><Plus size={18} /> New note</button>}
        />
      ) : (
        <>
          {pinned.length > 0 && (
            <section aria-labelledby="pinned-title">
              <h2 id="pinned-title" className="mb-4 flex items-center gap-2 text-2xl font-bold"><Pin size={20} className="text-lav-600" fill="currentColor" /> Pinned</h2>
              <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
                {pinned.map((n) => (
                  <NoteCard key={n.id} note={n} onEdit={openEditor} onPin={togglePin} onDelete={requestDelete} />
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="recent-title">
            <div className="mb-4 flex items-end justify-between">
              <h2 id="recent-title" className="text-2xl font-bold">Recently edited</h2>
              <Link to="/notes" className="inline-flex items-center gap-1.5 text-sm font-bold text-lav-700 hover:underline">
                All notes <ArrowRight size={16} />
              </Link>
            </div>
            <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
              {recent.map((n) => (
                <NoteCard key={n.id} note={n} onEdit={openEditor} onPin={togglePin} onDelete={requestDelete} />
              ))}
            </div>
          </section>
        </>
      )}

      <LocalNotesNotice />

      {toDelete && (
        <ConfirmDialog
          title="Delete this note?"
          text={`"${toDelete.title || "Untitled note"}" will be removed from this device. This can't be undone.`}
          onCancel={() => setToDelete(null)}
          onConfirm={() => {
            deleteNote(toDelete.id);
            setToDelete(null);
            toast.success("Note deleted");
          }}
        />
      )}
    </div>
  );
}
