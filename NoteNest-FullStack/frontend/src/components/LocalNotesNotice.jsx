import { Link } from "react-router-dom";
import { Info } from "lucide-react";

export default function LocalNotesNotice() {
  return (
    <p className="flex items-start gap-2.5 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-ink-soft">
      <Info size={18} className="mt-0.5 shrink-0 text-sky-500" />
      <span>
        Your sign-in is handled by the backend. Notes are saved on this device for this account, because the
        backend has no notes routes yet. <Link to="/settings" className="font-bold text-lav-700 underline underline-offset-2">Storage details</Link>
      </span>
    </p>
  );
}
