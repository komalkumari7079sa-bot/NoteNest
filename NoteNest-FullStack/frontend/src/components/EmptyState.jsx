export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-lav-200 bg-white/60 px-6 py-14 text-center">
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lav-100 text-lav-600">
        <Icon size={26} />
      </span>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
