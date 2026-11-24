import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, StickyNote, User, Settings as SettingsIcon, LogOut, Plus } from "lucide-react";
import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
import NoteModal from "../components/NoteModal";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NotesContext";
import { useToast } from "../context/ToastContext";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { openEditor } = useNotes();
  const toast = useToast();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    toast.success("You're signed out");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen md:grid md:grid-cols-[17rem_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-lav-100 bg-white/70 p-5 md:flex">
        <Logo to="/dashboard" />
        <button className="btn-primary mt-7 w-full" onClick={() => openEditor()}>
          <Plus size={18} /> New note
        </button>
        <nav className="mt-6 flex flex-col gap-1" aria-label="Main">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center gap-3 rounded-2xl px-4 text-sm font-bold transition ${
                  isActive ? "bg-lav-100 text-lav-700" : "text-ink-soft hover:bg-lav-50"
                }`
              }
            >
              <Icon size={19} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-cream-100 p-3">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user?.name}</p>
              <p className="truncate text-xs text-ink-mute">{user?.email}</p>
            </div>
          </div>
          <button className="btn-ghost mt-2 w-full justify-start !px-3" onClick={signOut}>
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-lav-100 bg-cream/90 px-4 py-3 backdrop-blur md:hidden">
        <Logo to="/dashboard" size={32} />
        <button className="btn-primary !min-h-[40px] !px-4" onClick={() => openEditor()}>
          <Plus size={17} /> New
        </button>
      </header>

      <main className="min-w-0 px-4 pb-28 pt-6 sm:px-8 md:pb-12 md:pt-10 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>

      {/* Bottom tabs (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-lav-100 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Main">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${
                isActive ? "text-lav-700" : "text-ink-mute"
              }`
            }
          >
            <Icon size={21} /> {label}
          </NavLink>
        ))}
      </nav>

      <NoteModal />
    </div>
  );
}
