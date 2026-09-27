/**
 * Bootstrap Icons (self-hosted) renderer for Circus UI icon slots.
 *
 * Two shapes exist in this codebase and they need different markup:
 *   1. icon DATA fields ("icon: 'bi bi-star-fill'") rendered as {item.icon} —
 *      these became plain class-name strings during the emoji migration; and
 *   2. real JSX slots inside markup, e.g. the emoji that used to sit inline in
 *      a heading or button label.
 *
 * Both funnel through here so sizing, colour and a11y stay consistent.
 *
 * `paths` exists because icon FONTS cannot survive the ticket PNG export:
 * html-to-image rasterizes the node into an SVG <foreignObject> and does not
 * carry the font across, so every <i> becomes an identical .notdef box. The
 * ticket's own icon is declared with its SVG path so it exports as real vector
 * geometry. Everything else renders through the font, which is correct on
 * screen and is the normal case.
 *
 * ponytail: only capture-critical icons carry `paths`. Add a path when an icon
 * must appear in an html-to-image export; it costs a few hundred bytes.
 */

const SVG_PATHS: Record<string, string> = {
  "ticket-perforated":
    "M4 4.85v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9z" +
    "M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3zM1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1.05a2.5 2.5 0 0 0 0 4.9v1.05a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1.05a2.5 2.5 0 0 0 0-4.9z",
};

export function Icon({
  name,
  className = "",
}: {
  /** Bootstrap Icons classes, e.g. "bi bi-star-fill". */
  name: string;
  className?: string;
}) {
  const bare = name.replace(/^bi\s*/, "").replace(/^bi-/, "");
  const path = SVG_PATHS[bare];

  if (path) {
    return (
      <svg
        className={`bi ${className}`.trim()}
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        {path.split("M").filter(Boolean).map((d, i) => (
          <path key={i} d={`M${d}`} />
        ))}
      </svg>
    );
  }

  return <i className={`${name} ${className}`.trim()} aria-hidden="true" />;
}
