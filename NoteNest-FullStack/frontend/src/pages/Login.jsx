import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { describeError } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(location.state?.notice || "");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to open your notes."
      footer={
        <>New to NoteNest? <Link to="/register" className="font-bold text-lav-700 underline underline-offset-2">Create an account</Link></>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {error && (
          <p role="alert" className="rounded-2xl bg-blush-100 px-4 py-3 text-sm font-medium text-blush-600">{error}</p>
        )}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <div className="relative">
            <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input id="email" type="email" autoComplete="email" className="input !pl-11" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input id="password" type={show ? "text" : "password"} autoComplete="current-password" className="input !px-11" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-mute hover:bg-lav-50">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn-primary w-full !min-h-[50px]" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
