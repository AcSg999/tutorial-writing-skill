# tutorial-writing-skill

> **Language:** English · [中文](README.md)

Turn the craft of writing mathematical and technical derivation notes into a reusable VS Code Copilot Agent Skill. The skill covers document structure, formula layout, explanation style, iteration, and delivery conventions.

It is designed for readers who have the necessary background but are new to the topic—for example, graduate students joining a research group. The goal is that a reader can reproduce every derivation step and implementation from a single tutorial.

## Core principles

Every rule serves these three priorities. When a template conflicts with the content, follow the content:

1. **Get the mathematics right.** Define symbols before using them; make one transformation per step and state its justification; check boundary and degenerate cases; numerically verify conclusions whenever possible.
2. **Keep derivations easy to follow.** Start with intuition, then formalize it; take one step at a time; follow every formula with a plain-language explanation; remove branches that do not serve the main line.
3. **Connect terminology into one chain.** For every new term, explain the problem it solves, what it is, and how it relates to terms already introduced.

The outline, question-style headings, `\boxed{}`, equation numbers, and checklists are tools—not rigid requirements.

## Quick start

### Installation

After installation, type `/skills` in Chat. The skill is ready when `tutorial-writing-skill` appears in the list.

#### Option 1: Install directly in VS Code (experimental)

1. Enable `chat.customizations.marketplace.enabled`.
2. Open the Agent Customizations editor (run **Chat: Open Customizations** from the Command Palette, or type `/skills` in Chat).
3. Open **Discover**, choose **GitHub Feed**, and search for `tutorial-writing-skill` (optionally filter with `@type:skill`).
4. Click **Install** and choose a personal or workspace installation.

#### Option 2: Clone from the command line (recommended)

```bash
# Personal: available in all projects on this machine
git clone https://github.com/AcSg999/tutorial-writing-skill.git \
  ~/.copilot/skills/tutorial-writing-skill

# Workspace: distribute with a project
git clone https://github.com/AcSg999/tutorial-writing-skill.git \
  .github/skills/tutorial-writing-skill

# Workspace submodule: convenient for future updates
git submodule add https://github.com/AcSg999/tutorial-writing-skill.git \
  .github/skills/tutorial-writing-skill
```

Windows PowerShell:

```powershell
git clone https://github.com/AcSg999/tutorial-writing-skill.git `
  "$env:USERPROFILE\.copilot\skills\tutorial-writing-skill"
```

#### Option 3: Download a ZIP

Choose **Code → Download ZIP** on the repository page, extract it into a skill directory, and rename `tutorial-writing-skill-main` to `tutorial-writing-skill`. The directory name must exactly match the `name` field in `SKILL.md`; otherwise the skill may fail to load silently.

### Supported skill directories

| Scope | Directories | Purpose |
| --- | --- | --- |
| Workspace | `.github/skills/`, `.claude/skills/`, `.agents/skills/` | Share with a project |
| Personal | `~/.copilot/skills/`, `~/.claude/skills/`, `~/.agents/skills/` | Use across projects on this machine |

Agent Skills is an open standard. The same directory can be reused by VS Code Copilot, GitHub Copilot CLI, Claude Code, and other compatible agents. After changing a skill directory, reload the window or start a new conversation.

## Usage

### Write a new tutorial

```text
Write a detailed derivation tutorial about 〈topic〉 using tutorial-writing-skill:
start from 〈mathematical starting point〉 and reach 〈final goal〉,
including motivation, a complete derivation, a minimal runnable implementation,
and a summary.
```

### Restructure an existing draft

```text
Restructure this document according to the tutorial-writing guidelines:
add the central question, motivation and conclusions for each section,
connect missing terms, and check for skipped derivation steps or
equal signs whose sources are unclear.
```

### Review a document

```text
Check whether this document follows the same guidelines:
mathematical correctness, clear and concise derivation,
connected terminology, and whether every conclusion answers
“what problem did this solve, and what did we obtain?”
```

## Formula verification

The verifier checks whether Markdown formulas render with KaTeX and catches common cross-platform issues, including raw Chinese text inside formulas, bare `\\` line breaks inside `$$`, `\(…\)` delimiters, and unstable macros such as `\newcommand`, `\ce`, `\SI`, and `\href`.

```bash
npm install
npm run verify                          # Verify all Markdown in the repository
node scripts/verify-math.mjs tutorial.md # Verify one file
```

The command exits with status `1` when it finds errors, so it can be used in CI or pre-commit checks. If you need PDF or HTML, export it from Markdown as the final step; Markdown remains the single source of truth.

## Default writing outline

The default sequence is:

1. YAML frontmatter
2. `> **Central question:**`
3. Introduction and reading route
4. Main references
5. Step-by-step sections organized around “why is this step needed?”
6. A summary that connects the full logic with “to solve what, we obtained what”

Each subsection should generally follow: **scenario or question → intuition → definitions and assumptions → derivation → conclusion → minimal implementation or numerical example**.

See [`SKILL.md`](SKILL.md) for the complete guidelines, workflow, checklist, and anti-patterns. See [`examples/skeleton-template.md`](examples/skeleton-template.md) for a copyable template.

## Repository structure

```text
SKILL.md
examples/
  skeleton-template.md
  screenshots/
reference/
  math-and-markdown.md
scripts/
  verify-math.mjs
package.json
LICENSE
```

- [`SKILL.md`](SKILL.md): complete writing guidelines, workflow, checklist, and anti-patterns
- [`examples/`](examples/): copyable template and rendering screenshots
- [`reference/math-and-markdown.md`](reference/math-and-markdown.md): formula details and KaTeX / MathJax compatibility notes
- [`scripts/verify-math.mjs`](scripts/verify-math.mjs): formula rendering verifier

## Rendering examples

![Document structure](examples/screenshots/01-document-structure.png)

![Formula layout](examples/screenshots/02-math-layout.png)

These screenshots were rendered from the template itself with KaTeX at 1.5× scale.

## FAQ

**The skill is installed but does not activate.** Check that the directory is named exactly `tutorial-writing-skill` and that it is under one of the supported paths above. Then reload the window or start a new conversation.

**Formulas render differently on GitHub and locally.** GitHub uses MathJax while the VS Code preview uses KaTeX. Read the [formula and Markdown reference](reference/math-and-markdown.md), then run `npm run verify`.

**Do I have to follow the default outline exactly?** No. Sections can be trimmed, merged, or reordered. The essential requirements are the three core principles and the safe formula subset shared by KaTeX and MathJax.

**I only want the verifier.** Copy `scripts/verify-math.mjs` and `package.json` into your documentation repository. Its only dependency is `katex`.

## Feedback and contributions

Open an Issue or PR to report problems or propose additional layout rules. A minimal reproducible Markdown example is especially helpful. This repository is MIT-licensed and can be forked and customized freely.

## License

[MIT](LICENSE)
