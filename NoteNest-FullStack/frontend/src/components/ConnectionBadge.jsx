import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { pingBackend } from "../services/authService";

// Live check against the backend's public GET /home route.
export default function ConnectionBadge() {
  const [state, setState] = useState("checking");

  const check = useCallback(async () => {
    setState("checking");
    setState((await pingBackend()) ? "online" : "offline");
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const styles = {
    checking: "bg-lav-100 text-lav-700",
    online: "bg-sky-100 text-sky-600",
    offline: "bg-blush-100 text-blush-600",
  };
  const labels = { checking: "Checking server", online: "Server connected", offline: "Server offline" };

  return (
    <button
      onClick={check}
      title="Check the backend connection again"
      className={`inline-flex min-h-[36px] items-center gap-2 rounded-full px-3.5 text-xs font-bold ${styles[state]}`}
    >
      <span className={`h-2 w-2 rounded-full ${state === "online" ? "bg-sky-500" : state === "offline" ? "bg-blush-500" : "bg-lav-400"}`} />
      {labels[state]}
      <RefreshCw size={13} className={state === "checking" ? "animate-spin" : ""} />
    </button>
  );
}
