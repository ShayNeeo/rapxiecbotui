# styling.md — Rap Xiec Bo Tui (Pocket Circus) visual contract

Single source of truth for the Vietnamese circus theme. Any new screen or
component must follow this file. Update this file when the theme changes.

## 1. Fonts (3 live, 2 dead)

| Role | Font | Wiring |
|---|---|---|
| Display headings | Bungee, class `.font-circus` (`src/index.css:64`) | Google Fonts in `index.html:11` |
| Body + UI | Be Vietnam Pro 400-900 (`src/index.css:60`) | Same link as above |
| 3D tent banner | Baloo 2 (`public/fonts/Baloo2-Bold.ttf`) | `src/components/circus/stage.tsx:99`, full VI glyphs |
| DEAD — remove | Patrick Hand / `.font-hand` (`src/index.css:69`) | Zero usages in `src`; only inflates font payload |
| DEAD — remove | LilitaOne-Regular.ttf (`public/fonts/`) | Unreferenced anywhere |

Rule: headings use `.font-circus`; body inherits Be Vietnam Pro. Never add a
font without updating `index.html`, `TICKET_FONT_CSS_URL`
(`src/components/CircusTicket.tsx`), and this file.

## 2. Palette

- Paper: `#FFFDF7` page, `#FFFDF8` ticket, `#fffdf9` inputs.
- Ink: `neutral-900` body; `red-900` display text on paper; `red-800` eyebrow labels.
- Burgundy heroes (dark): `#801414` via `#520909`/`#590d0d`/`#5c0e0e` to
  `#240404`/`#260505`. Chatbot: `#8a181b` → `#741316` → `#5a0c0f`.
  Footer/contact: `#1e0707`, `#2b0808` → `#1f0606` → `#120303`.
- Gold: `amber-400` structural borders, `amber-300` text on dark,
  `amber-200/100` surfaces, `#e8b93a` 3D accent, `#f59e0b` CSS accent var.
- Red: `#dc2626` primary var, `#b91c1c` tent stripes with `#fef08a`,
  `red-700` wax seal.
- Functional only: `emerald` (privileges text, unlocked checks), `sky/blue`
  (Facebook/Zalo brand buttons — intentional, nowhere else).

## 3. Signature patterns

- Hero: `rounded-3xl border-4 border-amber-400` + burgundy gradient +
  `.bg-circus-tent` overlay at `opacity-15/20` + bunting pennants (header) or
  spotlight radial (stage). See `CircusAbout.tsx:57`, `CircusStage.tsx:107`.
- Paper cards: `rounded-3xl border-2 amber-300/200`, white bg.
- Buttons (`ui/button.tsx`): `carnival` gradient (amber-500/orange-500/red-600),
  `gold` (amber-400), `outline` (white + amber-300 border).
- Ticket: `max-w-[460px]` paper card, perforated side notches
  (`.ticket-edge-left/right`), dashed amber dividers, mono serial pill,
  red wax seal, decorative barcode. Export keeps `#FFFDF8` bg.
- Dark 3D world: `.circus-3d-root` token overrides (`#140806` bg, `#f4ead3` fg).
- Motion: confetti + `circusAudio` on every claim/save/share; hover scale;
  `animate-in` fades. No linear easing on hero elements.

## 4. Rules for matching pages

1. Dark section = burgundy gradient + `amber-300` headings + `amber-100` body.
2. Light section = paper + `red-900` `.font-circus` headings + amber borders.
3. Structural borders: 4px `amber-400` heroes/modals; 2px `amber-300/200` cards.
4. Blue appears only on platform brand buttons. No other cool hues on paper.
5. Controls carry `no-print`; ticket print CSS pins 440px paper card, A4 portrait.
6. Export (`captureTicketImage`): single DPR-capped scale (max 3), cached Google
   Fonts embed CSS, `backgroundColor #FFFDF8`, filter drops `.no-print`.

## 5. Known mismatches (fix or justify)

- `CircusPromo.tsx:349` — A O Show card is the only cool card site-wide
  (`sky-50/indigo-50`, `sky-300` border). Restyle to amber/red paper.
- `CircusPromo.tsx:287-303` — sibling `h4` in emerald-950 / amber-950 /
  rose-950. Unify to `red-900`.
- `CircusMediaArchive.tsx:1548` — delete dialog `border-red-500`; other modals
  use `border-amber-400`. Align it.
- `ChatMessageItem.tsx:236` — `slate-900` code blocks. Keep as code-readability
  exception.
