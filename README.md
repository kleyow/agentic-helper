# agentic-helper

> A CLI tool for scaffolding and maintaining AI assistant context files in your repository.

Keeps [Claude](https://www.anthropic.com/claude), [GitHub Copilot](https://github.com/features/copilot), [Cursor](https://www.cursor.com/), [Windsurf](https://codeium.com/windsurf), [Aider](https://aider.chat/), [Amazon Q](https://aws.amazon.com/q/developer/), and other AI coding tools well-informed about your project.

## Install

```bash
# Global install (recommended)
npm install -g agentic-helper

# Or run directly with npx
npx agentic-helper init
```

## Usage

```
Usage: agh [options] [command]

Commands:
  init [options]       Interactive wizard to scaffold AI context files
  add [options] <type> Add a specific AI context file
  list [options]       List all available templates
  sync [options]       Check which files are present / missing
```

### `agh init`

Runs an interactive wizard that:

1. Auto-detects your project name, language, framework, and package manager from `package.json`.
2. Lets you override any detected values.
3. Prompts you to select which files to generate.
4. Writes all selected files (skips any that already exist unless `--force`).

```bash
agh init
agh init --force           # overwrite existing files
agh init --yes             # skip prompts, use defaults
agh init --cwd ./my-app    # target a different directory
```

### `agh add <type>`

Add a single file without going through the full wizard.

```bash
agh add claude
agh add copilot
agh add cursor
agh add agents
agh add windsurf
agh add aider
agh add amazonq
agh add architecture
agh add contributing
agh add skills
agh add context
agh add cursorrules      # legacy .cursorrules file
```

### `agh list`

List all available templates with their target paths and supported tool.

```bash
agh list
agh list --json          # machine-readable output
```

### `agh sync`

Scan your project and show which AI context files are present and which are missing.

```bash
agh sync
agh sync --cwd ./my-app
```

## Generated Files

| Command | File | Purpose |
|---------|------|---------|
| `claude` | `CLAUDE.md` | Anthropic Claude instructions |
| `copilot` | `.github/copilot-instructions.md` | GitHub Copilot custom instructions |
| `cursor` | `.cursor/rules/project.mdc` | Cursor AI rules (new format) |
| `cursorrules` | `.cursorrules` | Cursor AI rules (legacy) |
| `agents` | `AGENTS.md` | OpenAI Codex / autonomous agent instructions |
| `windsurf` | `.windsurfrules` | Windsurf AI rules |
| `aider` | `.aider.conf.yml` + `CONVENTIONS.md` | Aider config + coding conventions |
| `amazonq` | `.amazonq/rules/project.md` | Amazon Q Developer rules |
| `architecture` | `docs/ARCHITECTURE.md` | Architecture documentation |
| `contributing` | `CONTRIBUTING.md` | Contribution guide |
| `skills` | `.ai/skills.md` | Domain skills & knowledge |
| `context` | `.ai/context.md` | General project context |

## Philosophy

AI coding tools are only as useful as the context you give them. A well-maintained set of context files:

- Reduces hallucinations and incorrect assumptions.
- Enforces your team's coding conventions automatically.
- Speeds up onboarding for both humans and AI agents.
- Serves as living documentation for your project.

**Commit these files to your repository** so every developer and every AI session benefits.

## Requirements

- Node.js ≥ 18

## License

Apache-2.0
