# 橙子的博客

AstroPaper-based static blog for publishing Markdown essays.

## Project Structure

- `src/data/blog/`: published AstroPaper posts
- `articles/`: original article drafts/source copies
- `src/config.ts`: site metadata, language, timezone, and theme settings
- `public/`: static assets

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

Cloudflare Workers Static Assets build settings:

- Build command: `pnpm run build`
- Deploy command: `pnpm exec wrangler deploy`
- Non-production branch deploy command: `pnpm exec wrangler versions upload`
- Root directory: `/`
- Static assets directory: `dist` via `wrangler.jsonc`
- Environment variables:
  - `NODE_VERSION=22`
  - `PNPM_VERSION=10`

Production domain: `https://ai.sailfishc.com/`
