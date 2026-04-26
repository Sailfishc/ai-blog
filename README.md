# Writing

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

Cloudflare Pages build settings:

- Build command: `pnpm build`
- Build output directory: `dist`

Update `SITE.website` in `src/config.ts` before production deployment.
