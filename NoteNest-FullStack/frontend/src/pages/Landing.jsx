import { Link } from "react-router-dom";
import { Pin, Search, ShieldCheck, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: Pin,
    tint: "bg-blush-100 text-blush-600",
    title: "Pin what matters",
    text: "Keep the notes you reach for every day at the top, and let the rest settle below.",
  },
  {
    icon: Search,
    tint: "bg-sky-100 text-sky-600",
    title: "Find it as you type",
    text: "Search looks through titles and text at once, so a half-remembered word is enough.",
  },
  {
    icon: ShieldCheck,
    tint: "bg-lav-100 text-lav-600",
    title: "Your own account",
    text: "Register once, then sign in with a secure token. Every account has its own notes.",
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-2" aria-label="Account">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary">Open dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Sign in</Link>
              <Link to="/register" className="btn-primary">Create account</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
          <div>
            <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl">
              A calm nest for every thought worth keeping.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              Write quickly, pin the important ones, and find anything in a moment. NoteNest keeps your notes
              tidy, soft and out of the way.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={isAuthenticated ? "/notes" : "/register"} className="btn-primary !min-h-[52px] !px-7 !text-base">
                {isAuthenticated ? "Go to my notes" : "Start writing"} <ArrowRight size={18} />
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="btn-soft !min-h-[52px] !px-7 !text-base">I already have an account</Link>
              )}
            </div>
          </div>

          {/* Illustration of the note board (decorative) */}
          <div className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[30rem]" aria-hidden="true">
            <div className="absolute inset-x-6 bottom-2 top-6 rounded-[2.5rem] bg-lav-200" />
            <div className="absolute left-0 top-2 w-56 -rotate-6 rounded-3xl border border-blush-200 bg-blush-100 p-5 shadow-lift">
              <Pin size={16} className="mb-2 text-lav-600" fill="currentColor" />
              <p className="font-display text-lg font-bold">Project demo</p>
              <p className="mt-1 text-sm text-ink-soft">Practise the walkthrough. Save the slides as a PDF.</p>
            </div>
            <div className="absolute right-0 top-28 w-60 rotate-3 rounded-3xl border border-sky-200 bg-sky-100 p-5 shadow-lift">
              <p className="font-display text-lg font-bold">Reading list</p>
              <p className="mt-1 text-sm text-ink-soft">Two chapters before Monday. Ask for the lab notes.</p>
            </div>
            <div className="absolute bottom-0 left-8 w-60 -rotate-2 rounded-3xl border border-cream-200 bg-cream p-5 shadow-lift">
              <p className="font-display text-lg font-bold">Sunday reset</p>
              <p className="mt-1 text-sm text-ink-soft">Laundry, groceries, a long walk, an early night.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <h2 className="max-w-lg text-3xl font-bold sm:text-4xl">Small tools, done properly</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, tint, title, text }) => (
              <div key={title} className="panel">
                <span className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}>
                  <Icon size={22} />
                </span>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-lav-100 py-8 text-center text-sm text-ink-mute">
        NoteNest - a college project with a React frontend and an Express + MongoDB backend.
      </footer>
    </div>
  );
}
