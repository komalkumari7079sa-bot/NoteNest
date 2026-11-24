import Logo from "../components/Logo";

// Two-column layout for sign in / create account.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(0,0.9fr)]">
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>
        </div>
      </main>

      <aside className="relative hidden overflow-hidden bg-lav-200 lg:block" aria-hidden="true">
        <div className="absolute left-[12%] top-[14%] w-64 -rotate-6 rounded-3xl border border-blush-200 bg-blush-100 p-5 shadow-lift">
          <p className="font-display text-lg font-bold">Pick up milk and oat bars</p>
          <p className="mt-1 text-sm text-ink-soft">Also: parcel from the post office before 5.</p>
        </div>
        <div className="absolute right-[10%] top-[34%] w-72 rotate-3 rounded-3xl border border-sky-200 bg-sky-100 p-5 shadow-lift">
          <p className="font-display text-lg font-bold">Study plan for Friday</p>
          <p className="mt-1 text-sm text-ink-soft">Revise unit 3, finish the lab report, send slides to the group.</p>
        </div>
        <div className="absolute bottom-[12%] left-[18%] w-60 -rotate-2 rounded-3xl border border-cream-200 bg-cream p-5 shadow-lift">
          <p className="font-display text-lg font-bold">Ideas for the weekend</p>
          <p className="mt-1 text-sm text-ink-soft">Market walk, new playlist, call grandma.</p>
        </div>
      </aside>
    </div>
  );
}
