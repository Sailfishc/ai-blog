#!/usr/bin/env node
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const articlesDir = path.join(root, "articles");
const publishedDir = path.join(root, "src/data/blog");
const args = process.argv.slice(2);

const shouldSyncOnly = args.includes("--sync-only");
const shouldSkipVerify = args.includes("--skip-verify");
const shouldCommit = args.includes("--commit");
const shouldPush = args.includes("--push");
const messageArgIndex = args.indexOf("--message");
const commitMessage =
  messageArgIndex >= 0 && args[messageArgIndex + 1]
    ? args[messageArgIndex + 1]
    : "Publish article updates";

function run(command, commandArgs, options = {}) {
  const printable = [command, ...commandArgs].join(" ");
  console.log(`\n$ ${printable}`);
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    stdio: options.capture ? "pipe" : "inherit",
    encoding: "utf8",
  });

  if (result.status !== 0) {
    const stderr = result.stderr ? `\n${result.stderr}` : "";
    throw new Error(`Command failed: ${printable}${stderr}`);
  }

  return result.stdout ?? "";
}

async function listMarkdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith(".md"))
    .map(entry => entry.name)
    .sort();
}

function extractArticle(raw, sourcePath) {
  const normalized = raw.trimEnd() + "\n";
  const lines = normalized.split(/\r?\n/);
  const titleIndex = lines.findIndex(line => line.startsWith("# "));

  if (titleIndex < 0) {
    throw new Error(`Missing H1 title in ${sourcePath}`);
  }

  const title = lines[titleIndex].slice(2).trim();
  const bodyLines = [
    ...lines.slice(0, titleIndex),
    ...lines.slice(titleIndex + 1),
  ];
  const description =
    bodyLines.find(line => line.trim() && !line.startsWith("#"))?.trim() ??
    title;

  return {
    title,
    description,
    body: bodyLines.join("\n").trimStart(),
  };
}

function fallbackFrontmatter(slug) {
  return [
    "author: 橙子",
    `pubDatetime: ${new Date().toISOString()}`,
    `title: ${JSON.stringify(slug)}`,
    `slug: ${slug}`,
    "featured: false",
    "draft: false",
    "tags:",
    '  - "others"',
    `description: ${JSON.stringify(slug)}`,
  ];
}

async function readFrontmatter(targetPath, slug) {
  if (!existsSync(targetPath)) {
    return fallbackFrontmatter(slug);
  }

  const raw = await fs.readFile(targetPath, "utf8");
  const lines = raw.split(/\r?\n/);

  if (lines[0] !== "---") {
    throw new Error(`Published file is missing frontmatter: ${targetPath}`);
  }

  const endIndex = lines.findIndex((line, index) => index > 0 && line === "---");
  if (endIndex < 0) {
    throw new Error(`Published file has unterminated frontmatter: ${targetPath}`);
  }

  return lines.slice(1, endIndex);
}

function upsertScalar(lines, key, value) {
  const nextLine = `${key}: ${JSON.stringify(value)}`;
  const index = lines.findIndex(line => line.startsWith(`${key}:`));

  if (index >= 0) {
    lines[index] = nextLine;
    return;
  }

  lines.push(nextLine);
}

async function syncArticles() {
  const articleFiles = await listMarkdownFiles(articlesDir);
  const generated = [];

  await fs.mkdir(publishedDir, { recursive: true });

  for (const fileName of articleFiles) {
    const slug = fileName.replace(/\.md$/, "");
    const sourcePath = path.join(articlesDir, fileName);
    const targetPath = path.join(publishedDir, fileName);
    const article = extractArticle(await fs.readFile(sourcePath, "utf8"), sourcePath);
    const frontmatter = await readFrontmatter(targetPath, slug);

    upsertScalar(frontmatter, "title", article.title);
    upsertScalar(frontmatter, "description", article.description);

    const output = [
      "---",
      ...frontmatter,
      "---",
      article.body,
    ].join("\n");

    await fs.writeFile(targetPath, output.endsWith("\n") ? output : `${output}\n`);
    generated.push({ sourcePath, targetPath, title: article.title });
  }

  for (const item of generated) {
    console.log(`generated ${path.relative(root, item.targetPath)}: ${item.title}`);
  }
}

function hasArticleChanges() {
  const output = run(
    "git",
    ["status", "--short", "--", "articles", "src/data/blog"],
    { capture: true }
  );
  return output.trim().length > 0;
}

await syncArticles();

if (!shouldSyncOnly && !shouldSkipVerify) {
  run("pnpm", ["build"]);
  run("pnpm", ["exec", "wrangler", "deploy", "--dry-run"]);
}

if (shouldCommit) {
  if (hasArticleChanges()) {
    run("git", ["add", "articles", "src/data/blog"]);
    run("git", ["commit", "-m", commitMessage]);
  } else {
    console.log("No article changes to commit.");
  }
}

if (shouldPush) {
  run("git", ["push", "origin", "main"]);
}
