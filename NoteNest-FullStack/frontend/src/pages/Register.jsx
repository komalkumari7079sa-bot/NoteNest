import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { describeError } from "../services/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Enter your name.";
    if (!EMAIL_RE.test(form.email.trim())) return "Enter a valid email address.";
    if (form.password.length < 6) return "Use a password with at least 6 characters.";
    if (form.password !== form.confirm) return "The two passwords don't match.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await register({ name: form.name, email: form.email, password: form.password });
    } catch (err) {
      setError(describeError(err));
      setBusy(false);
      return;
    }
    // The backend's register route does not return a token, so sign in right away.
    try {
      await login(form.email, form.password);
      toast.success("Account created. Welcome to NoteNest!");
      navigate("/dashboard", { replace: true });
    } catch {
      navigate("/login", {
        replace: true,
        state: { email: form.email.trim(), notice: "Account created. Sign in to continue." },
      });
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes a few seconds, then your notes are ready."
      footer={
        <>Already registered? <Link to="/login" className="font-bold text-lav-700 underline underline-offset-2">Sign in</Link></>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <p role="alert" className="rounded-2xl bg-blush-100 px-4 py-3 text-sm font-medium text-blush-600">{error}</p>
        )}
        <div>
          <label htmlFor="name" className="label">Name</label>
          <div className="relative">
            <User size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input id="name" autoComplete="name" className="input !pl-11" placeholder="Your name" value={form.name} onChange={set("name")} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <div className="relative">
            <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input id="email" type="email" autoComplete="email" className="input !pl-11" placeholder="you@example.com" value={form.email} onChange={set("email")} />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input id="password" type={show ? "text" : "password"} autoComplete="new-password" className="input !px-11" placeholder="At least 6 characters" value={form.password} onChange={set("password")} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-mute hover:bg-lav-50">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirm" className="label">Confirm password</label>
          <div className="relative">
            <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input id="confirm" type={show ? "text" : "password"} autoComplete="new-password" className="input !pl-11" placeholder="Type it again" value={form.confirm} onChange={set("confirm")} />
          </div>
        </div>
        <button type="submit" className="btn-primary w-full !min-h-[50px]" disabled={busy}>
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
