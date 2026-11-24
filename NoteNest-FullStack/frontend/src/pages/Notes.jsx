import { useState } from "react";
import { Search, Plus, LayoutGrid, List, X, StickyNote, SearchX, Pin } from "lucide-react";
import { useNotes } from "../context/NotesContext";
import { usePrefs } from "../context/PrefsContext";
import { useToast } from "../context/ToastContext";
import NoteCard from "../components/NoteCard";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import LocalNotesNotice from "../components/LocalNotesNotice";
import { searchNotes, sortNotes } from "../services/notesService";

export default function Notes() {
  const { notes, togglePin, deleteNote, openEditor } = useNotes();
  const { prefs, setPref } = usePrefs();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [toDelete, setToDelete] = useState(null);

  const base = filter === "pinned" ? notes.filter((n) => n.pinned) : notes;
  const results = sortNotes(searchNotes(base, query), prefs.sort);
  const pinnedResults = filter === "all" ? results.filter((n) => n.pinned) : [];
  const otherResults = filter === "all" ? results.filter((n) => !n.pinned) : results;
  const isList = prefs.view === "list";
  const layoutClass = isList ? "flex flex-col gap-3" : "columns-1 gap-4 sm:columns-2 xl:columns-3";

  const requestDelete = (note) => {
    if (prefs.confirmDelete) setToDelete(note);
    else {
      deleteNote(note.id);
      toast.success("Note deleted");
    }
  };

  const renderGroup = (list) => (
    <div className={layoutClass}>
      {list.map((n) => (
        <NoteCard key={n.id} note={n} view={prefs.view} onEdit={openEditor} onPin={togglePin} onDelete={requestDelete} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Notes</h1>
          <p className="mt-1.5 text-ink-soft">{notes.length} {notes.length === 1 ? "note" : "notes"} in your nest</p>
        </div>
        <button className="btn-primary hidden md:inline-flex" onClick={() => openEditor()}>
          <Plus size={18} /> New note
        </button>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
          <label htmlFor="search" className="sr-only">Search notes</label>
          <input id="search" type="search" className="input !pl-11 !pr-11" placeholder="Search titles and text" value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-mute hover:bg-lav-50">
              <X size={17} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full bg-white p-1 shadow-soft" role="tablist" aria-label="Filter notes">
            {[["all", "All"], ["pinned", "Pinned"]].map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={filter === value}
                onClick={() => setFilter(value)}
                className={`min-h-[40px] rounded-full px-5 text-sm font-bold transition ${filter === value ? "bg-lav-600 text-white" : "text-ink-soft hover:bg-lav-50"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <label htmlFor="sort" className="sr-only">Sort notes</label>
          <select id="sort" value={prefs.sort} onChange={(e) => setPref("sort", e.target.value)} className="input !w-auto !rounded-full !py-2.5 !pr-9 font-medium">
            <option value="updated">Recently edited</option>
            <option value="created">Newest first</option>
            <option value="title">Title A-Z</option>
          </select>

          <div className="inline-flex rounded-full bg-white p-1 shadow-soft" role="group" aria-label="Layout">
            {[["grid", LayoutGrid, "Grid view"], ["list", List, "List view"]].map(([value, Icon, label]) => (
              <button
                key={value}
                onClick={() => setPref("view", value)}
                aria-label={label}
                aria-pressed={prefs.view === value}
                title={label}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${prefs.view === value ? "bg-lav-100 text-lav-700" : "text-ink-soft hover:bg-lav-50"}`}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes yet"
          text="Create your first note. You can pick a colour and pin it to keep it on top."
          action={<button className="btn-primary" onClick={() => openEditor()}><Plus size={18} /> New note</button>}
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={query ? "No notes match your search" : "Nothing pinned yet"}
          text={query ? `Nothing contains "${query}". Try a shorter word.` : "Use the pin on any note to keep it here."}
          action={query ? <button className="btn-soft" onClick={() => setQuery("")}>Clear search</button> : null}
        />
      ) : (
        <>
          {pinnedResults.length > 0 && (
            <section aria-labelledby="pinned-heading">
              <h2 id="pinned-heading" className="mb-3 flex items-center gap-2 text-lg font-bold text-ink-soft"><Pin size={17} className="text-lav-600" fill="currentColor" /> Pinned</h2>
              {renderGroup(pinnedResults)}
            </section>
          )}
          {otherResults.length > 0 && (
            <section aria-labelledby="others-heading">
              {pinnedResults.length > 0 && <h2 id="others-heading" className="mb-3 mt-8 text-lg font-bold text-ink-soft">Others</h2>}
              {renderGroup(otherResults)}
            </section>
          )}
          {query && <p className="text-sm text-ink-mute" aria-live="polite">{results.length} {results.length === 1 ? "match" : "matches"}</p>}
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
