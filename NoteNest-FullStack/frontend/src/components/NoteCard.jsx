import { Pin, Pencil, Trash2 } from "lucide-react";
import { NOTE_COLORS } from "../services/notesService";
import { timeAgo } from "../services/format";

export default function NoteCard({ note, view = "grid", onEdit, onPin, onDelete }) {
  const c = NOTE_COLORS[note.color] || NOTE_COLORS.lavender;
  const isList = view === "list";

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border p-5 pr-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift ${c.card} ${
        isList ? "" : "mb-4 break-inside-avoid"
      }`}
    >
      {/* folded corner */}
      <span className={`pointer-events-none absolute bottom-0 right-0 h-7 w-7 rounded-tl-2xl ${c.fold}`} aria-hidden="true" />

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold leading-snug">{note.title || "Untitled note"}</h3>
        <button
          onClick={() => onPin(note.id)}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
          aria-pressed={note.pinned}
          title={note.pinned ? "Unpin" : "Pin to top"}
          className={`-mr-1.5 -mt-1.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
            note.pinned ? "bg-white text-lav-600 shadow-soft" : "text-ink-soft hover:bg-white/70"
          }`}
        >
          {note.pinned ? <Pin size={18} fill="currentColor" /> : <Pin size={18} />}
        </button>
      </div>

      {note.content && (
        <p className={`mt-2 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink-soft ${isList ? "line-clamp-2" : "line-clamp-6"}`}>
          {note.content}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 pr-7">
        <span className="text-xs font-medium text-ink-mute">Edited {timeAgo(note.updatedAt)}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(note)}
            aria-label={`Edit ${note.title || "note"}`}
            title="Edit"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-white/80 hover:text-lav-700"
          >
            <Pencil size={17} />
          </button>
          <button
            onClick={() => onDelete(note)}
            aria-label={`Delete ${note.title || "note"}`}
            title="Delete"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-white/80 hover:text-blush-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

