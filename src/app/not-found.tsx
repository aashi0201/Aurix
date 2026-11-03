import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container section">
      <span className="eyebrow">A SMALL DETOUR</span>
      <h1>This page isn’t on the map.</h1>
      <p>Let’s get you back to planning your journey.</p>
      <Link className="button" href="/">
        Back to home
      </Link>
    </section>
  );
}
