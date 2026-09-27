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
 * Icons present in `SVG_PATHS` render as inline SVG rather than a webfont
 * glyph. That is required, not a preference, for the two places a webfont
 * cannot work: the html-to-image ticket export, and SVG <text>/<g> on the map.
 * Everywhere else the font is correct and much smaller.
 */

import { SVG_PATHS, type IconPath } from "@/src/lib/icon-paths";

function SvgGlyph({
  paths,
  className,
  size,
}: {
  paths: readonly IconPath[];
  className: string;
  /** Render at this pixel size; defaults to 1em (inherit the text size). */
  size?: number;
}) {
  return (
    <svg
      className={`bi ${className}`.trim()}
      width={size ?? "1em"}
      height={size ?? "1em"}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map(([d, fillRule], i) => (
        <path key={i} d={d} fillRule={fillRule ?? undefined} />
      ))}
    </svg>
  );
}

export function Icon({
  name,
  className = "",
  size,
}: {
  /** Bootstrap Icons classes, e.g. "bi bi-star-fill". */
  name: string;
  className?: string;
  size?: number;
}) {
  const bare = name.replace(/^bi\s*/, "").replace(/^bi-/, "");
  const paths = SVG_PATHS[bare];

  if (paths) {
    return <SvgGlyph paths={paths} className={className} size={size} />;
  }

  // Not a Bootstrap class. Some data fields legitimately hold a real character
  // - the circus motif emoji is kept on purpose - so render it as text rather
  // than as a (width-0, invisible) class name.
  if (!/^bi(-|\s|$)/.test(name)) {
    return (
      <span className={className} aria-hidden="true">
        {name}
      </span>
    );
  }

  return (
    <i
      className={`${name} ${className}`.trim()}
      style={size ? { fontSize: `${size}px` } : undefined}
      aria-hidden="true"
    />
  );
}

/**
 * For icons drawn INSIDE an existing <svg> (the map), where neither HTML nor a
 * webfont glyph can render. Returns a <g> scaled into SVG user units and
 * centred on (x, y), since the glyphs are authored on a 16x16 grid.
 */
export function SvgIconGlyph({
  name,
  x = 0,
  y = 0,
  size = 8,
  color,
}: {
  name: string;
  x?: number;
  y?: number;
  /** Width/height in SVG user units. */
  size?: number;
  color?: string;
}) {
  const bare = name.replace(/^bi\s*/, "").replace(/^bi-/, "");
  const paths = SVG_PATHS[bare];
  // No path data: fall back to the character itself, scaled into user units.
  if (!paths) {
    return (
      <text
        x={x}
        y={y}
        fontSize={size}
        textAnchor="middle"
        dominantBaseline="central"
        fill={color ?? "currentColor"}
        aria-hidden="true"
      >
        {name}
      </text>
    );
  }
  const s = size / 16;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s}) translate(-8 -8)`}
      fill={color ?? "currentColor"}
      aria-hidden="true"
    >
      {paths.map(([d, fillRule], i) => (
        <path key={i} d={d} fillRule={fillRule ?? undefined} />
      ))}
    </g>
  );
}
