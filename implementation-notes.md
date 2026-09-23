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
