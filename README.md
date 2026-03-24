# Security+ SY0-701 Prep (Static)

Static Next.js site for CompTIA Security+ practice with:

- 35 mock tests
- 90 questions per test
- 90-minute timer + auto-submit
- Single, multiple, and scenario-style questions
- Study module with full topic sections and anchors
- Local progress + results in browser storage

## Architecture

- Fully static export (`next.config.ts` uses `output: "export"`)
- No API routes
- No server/database dependency for runtime
- Firebase Hosting serves static files from `out/`

## Run locally

```bash
npm install
npm run dev
```

## Build static output

```bash
npm run build
```

This generates the static site in `out/`.

## Deploy to Firebase Hosting

```bash
firebase login
firebase use neurosc1
npm run build
firebase deploy --only hosting
```

## Notes

- Dashboard was removed by design.
- Study progress and exam attempts are saved in browser `localStorage`.
- Clearing browser storage resets saved progress/results.
