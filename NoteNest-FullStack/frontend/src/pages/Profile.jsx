import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Check, X, LogOut, Mail, KeyRound, Pin, StickyNote } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NotesContext";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/Avatar";
import ConnectionBadge from "../components/ConnectionBadge";

export default function Profile() {
  const { user, token, updateName, logout } = useAuth();
  const { notes } = useNotes();
  const toast = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const saveName = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateName(name);
    setEditing(false);
    toast.success("Name updated");
  };

  const signOut = () => {
    logout();
    toast.success("You're signed out");
    navigate("/", { replace: true });
  };

  // Only the start of the token is shown - the rest stays private.
  const tokenPreview = token ? `${token.slice(0, 12)}...${token.slice(-6)}` : "";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold sm:text-4xl">Profile</h1>
        <p className="mt-1.5 text-ink-soft">Your account on this device.</p>
      </header>

      <section className="panel flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar name={user?.name} size={88} />
        <div className="min-w-0 flex-1">
          {editing ? (
            <form onSubmit={saveName} className="flex flex-wrap items-center gap-2">
              <label htmlFor="display-name" className="sr-only">Display name</label>
              <input id="display-name" className="input !w-auto min-w-[14rem] flex-1" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoFocus />
              <button type="submit" className="btn-primary !px-4" aria-label="Save name"><Check size={18} /></button>
              <button type="button" className="btn-ghost !px-4" aria-label="Cancel" onClick={() => { setEditing(false); setName(user?.name || ""); }}><X size={18} /></button>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-3xl font-bold">{user?.name}</h2>
              <button onClick={() => setEditing(true)} aria-label="Edit name" title="Edit name" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-lav-50">
                <Pencil size={17} />
              </button>
            </div>
          )}
          <p className="mt-1 flex items-center gap-2 text-ink-soft"><Mail size={16} /> <span className="truncate">{user?.email}</span></p>
          <p className="mt-3 text-xs text-ink-mute">
            The backend doesn't send your name back when you sign in, so NoteNest remembers it on this device.
            Changing it here doesn't change the account stored in the database.
          </p>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <div className="panel flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lav-100 text-lav-600"><StickyNote size={22} /></span>
          <div><p className="font-display text-3xl font-bold">{notes.length}</p><p className="text-sm text-ink-soft">Notes written</p></div>
        </div>
        <div className="panel flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-100 text-blush-600"><Pin size={22} /></span>
          <div><p className="font-display text-3xl font-bold">{notes.filter((n) => n.pinned).length}</p><p className="text-sm text-ink-soft">Notes pinned</p></div>
        </div>
      </section>

      <section className="panel">
        <h2 className="text-xl font-bold">Session</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="flex items-center gap-2 font-bold"><KeyRound size={17} className="text-lav-600" /> Sign-in token</dt>
            <dd className="rounded-full bg-cream-100 px-3 py-1 font-mono text-xs text-ink-soft">{tokenPreview}</dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="font-bold">Backend connection</dt>
            <dd><ConnectionBadge /></dd>
          </div>
        </dl>
        <button className="btn-danger mt-6" onClick={signOut}><LogOut size={18} /> Sign out</button>
      </section>
    </div>
  );
}
