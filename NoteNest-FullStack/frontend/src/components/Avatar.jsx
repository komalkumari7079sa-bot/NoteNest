export default function Avatar({ name = "", size = 40 }) {
  const letter = (name.trim()[0] || "?").toUpperCase();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-blush-200 font-display font-bold text-blush-600"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}
