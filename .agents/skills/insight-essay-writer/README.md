# insight-essay-writer v6 publish-polish

Use this skill to turn one or more source materials into a publishable high-insight Chinese longform essay.

v6 focuses on final publication quality:

- honest source voice, so secondary materials never sound like first-hand interviews
- direct positive titles and thesis sentences
- stronger claim calibration for trend claims
- reader artifacts that work as real decision tools
- Best-of-N synthesis that preserves the champion draft's spine
- clean public output with research notes kept internal

## Install

Claude Code:

```bash
mkdir -p ~/.claude/skills
unzip insight-essay-writer-v6-publish-polish.zip -d ~/.claude/skills
```

Codex:

```bash
mkdir -p ~/.agents/skills
unzip insight-essay-writer-v6-publish-polish.zip -d ~/.agents/skills
```

## Example prompt

```text
Use insight-essay-writer. Read the attached materials and write a publishable Chinese essay. Keep all research notes internal. Make the title and section headings natural, and include one usable reader-facing decision tool.
```

Best-of-N review:

```text
Use insight-essay-writer in Best-of-N mode. Compare these drafts from the same source material. Pick the champion, salvage the best modules from the other drafts, and identify skill improvements.
```
