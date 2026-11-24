import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ title, text, confirmLabel = "Delete", onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-4 animate-fade-in sm:items-center" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm animate-pop-in rounded-3xl bg-white p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-100 text-blush-600">
          <AlertTriangle size={22} />
        </span>
        <h2 id="confirm-title" className="text-xl font-bold">{title}</h2>
        <p className="mt-1.5 text-sm text-ink-soft">{text}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onCancel} autoFocus>Keep it</button>
          <button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
