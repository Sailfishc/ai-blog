---
name: blog-article-formatter
description: Use when preparing this AstroPaper blog's articles for publication from articles/*.md. Formats draft/source article Markdown into clean public Chinese blog posts before the deterministic publish script syncs them to src/data/blog, builds, commits, and pushes.
---

# Blog Article Formatter

## Purpose

Prepare `articles/*.md` as polished public source articles. This skill handles editorial judgment; the repo script handles deterministic publishing.

Use this before running:

```bash
pnpm articles:publish
```

## Input and output

- Input: one or more source drafts in `articles/*.md`.
- Edit target: the same `articles/*.md` files.
- Do not edit `src/data/blog/*.md` by hand unless fixing script output.
- After formatting, run `pnpm articles:verify` or `pnpm articles:publish`.

## Formatting contract

Each article in `articles/` should be publishable Markdown:

1. Exactly one H1 at the top.
2. No YAML frontmatter in `articles/`.
3. No internal workbench notes in the public article: remove source maps, thesis tournaments, scoring notes, prompt notes, model notes, and process logs.
4. The first real paragraph must work as the AstroPaper description after sync.
5. Section headings should be natural public headings, not internal framework labels.
6. Keep one strong reader-gain artifact when useful: a decision table, checklist, routing table, failure-mode list, or operating model.
7. End with a short `资料来源` section only when source traceability matters.

## Editorial pass

For each changed source article:

1. Read the full file.
2. Identify the central argument in one sentence.
3. Check whether the opening gives a concrete scene, tension, or reader problem.
4. Tighten the spine so every section supports one argument.
5. Remove duplicated claims and repeated transitions.
6. Convert internal labels into reader-facing headings.
7. Preserve concrete names, numbers, examples, and boundaries from the source.
8. Calibrate claims: do not overstate what a transcript, podcast, source note, or secondary clipping can prove.
9. Keep the author's Chinese voice direct and analytical.
10. Leave the article as plain Markdown with no frontmatter.

## When to use insight-essay-writer

If the source is rough material, multiple drafts, transcripts, research notes, or needs a full argument rebuild, use `insight-essay-writer` first to produce the publishable article. Then use this skill as the final repo-specific format pass.

If the source is already a mostly finished essay, do not rewrite from scratch. Make the smallest editorial changes needed for publication quality and AstroPaper compatibility.

## Publish handoff

After formatting:

```bash
pnpm articles:verify
```

If verification passes and the user wants deployment:

```bash
pnpm articles:publish
```

`articles:publish` syncs `articles/*.md` into `src/data/blog/*.md`, runs the static build and Wrangler dry-run, commits changed article files, and pushes `main`.
