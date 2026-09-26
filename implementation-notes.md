# Implementation Notes

### What changed
- Integrated the provided [rapxiecbotui.zip](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/rapxiecbotui.zip) portal codebase as the main application page (`/`), with the AI Chatbot hosted at `/chatbot`:
  - Extracted portal modules:
    - `src/components/Circus*` (`CircusHeader`, `CircusStage`, `CircusHistory`, `Circus3D`, `CircusMediaArchive`, `CircusMap`, `CircusAbout`, `CircusTicket`, `CircusPromo`, `CircusQuiz`).
    - `src/components/history/` (`MilestonePage`, `HistoryHome`, `AddPhotoDialog`, `PhotoLightboxModal`).
    - `src/components/ui/button.tsx`, `src/context/LanguageContext.tsx`, `src/i18n/translations.ts`, `src/lib/`, `src/utils/audio.ts`.
    - Static assets into `public/` and `src/assets/images/`.
  - Installed missing portal dependencies: `canvas-confetti`, `@types/canvas-confetti`, `class-variance-authority`, `clsx`, `tailwind-merge`, `three`, `@types/three`, `motion`, `html-to-image`, `react-router-dom`.
  - Created [src/components/icons/Facebook.tsx](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/src/components/icons/Facebook.tsx) to provide a modern SVG icon replacing deprecated lucide icon exports.
  - Migrated our full Gemini RAG Chatbot to [src/pages/ChatbotPage.tsx](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/src/pages/ChatbotPage.tsx) with a "← Quay lại Rạp Xiếc Bỏ Túi" portal navigation button.
  - Set up application routing in [src/App.tsx](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/src/App.tsx):
    - Route `/`: Renders [src/pages/CircusPortalPage.tsx](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/src/pages/CircusPortalPage.tsx) (Main Circus Portal).
    - Route `/chatbot`: Renders [src/pages/ChatbotPage.tsx](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/src/pages/ChatbotPage.tsx) (AI Chatbot with Gemini 3.5 Flash Lite + Gemini Embedding 2 RAG).
  - Updated [src/lib/constants.ts](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/src/lib/constants.ts) (`CHATBOT_AI_URL = "/chatbot"`) and [src/components/CircusHeader.tsx](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/src/components/CircusHeader.tsx) to route internal `/chatbot` links via React Router.
  - Wrapped root in [src/main.tsx](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/src/main.tsx) with `LanguageProvider`.
  - Configured `@/` path alias and `logoUploadPlugin` in [vite.config.ts](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/vite.config.ts).
  - Updated [index.html](file:///home/shayneeo/Downloads/Documents/Coding/Linh-example/index.html) with vintage circus Google fonts (`Bungee`, `Patrick Hand`, `Be Vietnam Pro`).

### Decisions / tradeoffs
- **Multi-Route Architecture**: Used `react-router-dom` to cleanly isolate `/` (Circus Portal) and `/chatbot` (AI Chatbot) while preserving state and allowing fast instant transitions between them.
- **Internal vs External Chatbot Navigation**: Updated `CircusHeader.tsx` to detect internal paths (`/chatbot`) and use React Router `<Link>` instead of opening an external target window, creating a unified single-page application experience.
- **Module Resolution & Paths**: Configured path aliases in both `vite.config.ts` and `tsconfig.app.json` so that `@/src/...` imports resolve without breaking existing bundle optimizations.

### Verification
- `rtk pnpm run build`: Succeeded in 838ms (`tsc -b && vite build` passed with zero errors, producing production bundle).
- `rtk pnpm run lint`: Succeeded with 0 errors (`oxlint`).
- **GitHub Public Repository**: Created and pushed to [https://github.com/ShayNeeo/rapxiecbotui](https://github.com/ShayNeeo/rapxiecbotui) with clean git commit history, untracked local secrets (`.env.local`), and active `main` branch.

### Ticket PNG export geometry (2026-09-27)
- **What changed** (`src/components/CircusTicket.tsx` only):
  - `toPng` scale: `canvasWidth*2` + `pixelRatio: 2` multiplied to 4x output and OOM'd mobile browsers. Now a single `pixelRatio: Math.max(2, Math.min(devicePixelRatio, 3))`. The `Math.max(2, ...)` floor matters: a bare `Math.min(dpr, 3)` collapses DPR=1 desktops to 1x, turning a 452px card into a 452px PNG.
  - `toPng` `style: { margin: "0" }` — root cause of the clipped captures. The card's `mx-auto` was re-centering ~205px right inside html-to-image's foreignObject (whose container width differs from the page), cutting every right-anchored string: masthead, serial, date column, benefits, seal, footer.
  - Capture width measured with `clientWidth`, not `scrollWidth` (scrollWidth includes offscreen overflow and rasterized a double-wide capture).
  - Cached Google Fonts embed CSS (`getTicketFontEmbedCSS`) so each capture skips the refetch and never inspects cross-origin stylesheets.
  - Save and share modals always re-capture on open (~200ms). A PNG cached from a previous viewport served stale double-wide captures; keying the cache on width would need state we don't track.
  - Preview `<img>` sized by height (`w-auto max-w-full h-auto`) with a `min-w-0` parent — `w-full` letterboxed portrait captures.
  - Header no longer truncates: dropped `truncate` / `whitespace-nowrap`.
  - Added `styling.md` (visual contract: fonts, palette, spacing for future screens).
- **Decisions / tradeoffs**: took upstream's `CircusTicket.tsx` wholesale rather than resolving the rebase conflict line-by-line. An earlier local commit also removed the rename/logo state as "dead" — that was wrong: upstream has a live `Đổi tên` UI (`isEditingName`/`tempName`, persisted to `pocket_circus_visitor_name`) and `CircusHeader`/`CircusStage`/`CircusPromo` still consume `logoUrl`/`onUploadLogo`/`onResetLogo`. Only the capture-geometry fixes were re-applied; the rename UI and every logo prop are untouched.
- **Verification**:
  - `rtk pnpm run build`: clean, 1.08s, zero TS errors.
  - `rtk pnpm run lint`: 0 errors (pre-existing warnings unchanged, none new).
  - CDP DOM geometry at 1280x900 / 390x844 / 320x700: 12/12 pass. `naturalWidth / card.clientWidth == 2.0` exactly (904/452, 652/326, 512/256); one preview image, no page overflow, modal present. DOM geometry rather than vision reads — at preview scale vision invents ticket text that isn't there.
  - Two harness gotchas worth keeping: the main save button goes through `showSaveFilePicker`, which never resolves headless, so the check asserts on the share modal (identical `captureTicketImage()` path). And the user's long-lived debug Chrome already holds CDP port 9222 — a checker bound to 9222 silently attaches to that browser and reports false failures; use a free port.
