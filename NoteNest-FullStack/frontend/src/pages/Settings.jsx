import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Trash2, LogOut, Server, LayoutGrid, List } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NotesContext";
import { usePrefs } from "../context/PrefsContext";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";
import ConnectionBadge from "../components/ConnectionBadge";

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-bold">{label}</p>
        {hint && <p className="text-sm text-ink-soft">{hint}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition ${checked ? "bg-lav-600" : "bg-lav-200"}`}
      >
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? "left-7" : "left-1"}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const { notes, clearAll } = useNotes();
  const { prefs, setPref } = usePrefs();
  const toast = useToast();
  const navigate = useNavigate();
  const [confirmClear, setConfirmClear] = useState(false);

  const apiTarget = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const sizeKb = (new Blob([JSON.stringify(notes)]).size / 1024).toFixed(1);

  const exportNotes = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notenest-notes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Notes exported");
  };

  const signOut = () => {
    logout();
    toast.success("You're signed out");
    navigate("/", { replace: true });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold sm:text-4xl">Settings</h1>
        <p className="mt-1.5 text-ink-soft">Saved for {user?.email} on this device.</p>
      </header>

      <section className="panel space-y-6">
        <h2 className="text-xl font-bold">Your notes</h2>
        <div>
          <p className="mb-2 font-bold">Default layout</p>
          <div className="inline-flex rounded-full bg-lav-50 p-1" role="group" aria-label="Default layout">
            {[["grid", LayoutGrid, "Grid"], ["list", List, "List"]].map(([value, Icon, label]) => (
              <button key={value} onClick={() => setPref("view", value)} aria-pressed={prefs.view === value}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-5 text-sm font-bold transition ${prefs.view === value ? "bg-lav-600 text-white" : "text-ink-soft"}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="default-sort" className="mb-2 block font-bold">Default order</label>
          <select id="default-sort" className="input !w-auto" value={prefs.sort} onChange={(e) => setPref("sort", e.target.value)}>
            <option value="updated">Recently edited</option>
            <option value="created">Newest first</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
        <Toggle label="Ask before deleting" hint="Show a confirmation before a note is removed." checked={prefs.confirmDelete} onChange={(v) => setPref("confirmDelete", v)} />
      </section>

      <section className="panel">
        <h2 className="text-xl font-bold">Storage</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          The backend provided for this project handles accounts and sign-in only. Notes are saved in this browser
          ({notes.length} {notes.length === 1 ? "note" : "notes"}, about {sizeKb} KB), so they stay on this device and
          are not shared between browsers. Export a copy whenever you want a backup.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="btn-soft" onClick={exportNotes} disabled={notes.length === 0}><Download size={18} /> Export notes (JSON)</button>
          <button className="btn-danger" onClick={() => setConfirmClear(true)} disabled={notes.length === 0}><Trash2 size={18} /> Delete all notes</button>
        </div>
      </section>

      <section className="panel">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Server size={20} className="text-lav-600" /> Backend connection</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex flex-wrap justify-between gap-2"><dt className="font-bold">Backend address</dt><dd className="font-mono text-ink-soft">{apiTarget}</dd></div>
          <div className="flex flex-wrap justify-between gap-2"><dt className="font-bold">Used by this app</dt><dd className="text-ink-soft">POST /user/register, POST /user/login, GET /dashboard, GET /home</dd></div>
          <div className="flex flex-wrap items-center justify-between gap-2"><dt className="font-bold">Status</dt><dd><ConnectionBadge /></dd></div>
        </dl>
      </section>

      <section className="panel">
        <h2 className="text-xl font-bold">Account</h2>
        <button className="btn-danger mt-4" onClick={signOut}><LogOut size={18} /> Sign out</button>
      </section>

      {confirmClear && (
        <ConfirmDialog
          title="Delete all notes?"
          text={`All ${notes.length} notes for this account will be removed from this device. Export them first if you want a copy.`}
          confirmLabel="Delete all"
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => {
            clearAll();
            setConfirmClear(false);
            toast.success("All notes deleted");
          }}
        />
      )}
    </div>
  );
}
