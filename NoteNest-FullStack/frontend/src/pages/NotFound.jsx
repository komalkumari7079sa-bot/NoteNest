import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <h1 className="text-5xl font-bold">This page isn't in the nest</h1>
      <p className="max-w-sm text-ink-soft">The link may be mistyped or the page may have moved.</p>
      <Link to="/" className="btn-primary">Back to the start</Link>
    </div>
  );
}
