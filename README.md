# ArchVision AI — Architectural Visualization SaaS

A React + TypeScript SaaS starter that turns uploaded 2D floor plans into AI-generated photorealistic 3D visualization concepts using model routing (Claude, Gemini, and GPT variants) with Puter.js integrations.

## Features

- **2D → 3D render generation workflow** with prompt + style controls.
- **Multi-model AI selection** (Claude, Gemini, GPT options).
- **Puter.js integration hooks** for:
  - AI summarization (`puter.ai.chat`)
  - Permanent file hosting (`puter.fs.upload`)
- **Persistent metadata storage** via browser KV-style persistence (`localStorage`) for serverless-friendly architecture.
- **Global community feed UI** with likes, timestamps, and source plan links.
- **Production-ready TypeScript + Vite setup**.

## Quick start

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Architecture Notes

- `src/App.tsx`: Main SaaS dashboard and user workflow.
- `src/services.ts`: Serverless worker-like orchestration for uploads, AI summarization, and KV persistence.
- `src/types.ts`: Shared data contracts for render metadata.
- `src/puter.d.ts`: Optional Puter.js typings.

When Puter.js is unavailable, the app gracefully falls back to local object URLs and deterministic mock AI copy.
