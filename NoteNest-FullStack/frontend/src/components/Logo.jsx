import { Link } from "react-router-dom";
import mark from "../assets/notenest-mark.svg";

export default function Logo({ to = "/", size = 36 }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2.5" aria-label="NoteNest home">
      <img src={mark} width={size} height={size} alt="" />
      <span className="font-display text-xl font-bold tracking-tight text-ink">NoteNest</span>
    </Link>
  );
}
