/**
 * Registry of all supported AI context file templates.
 *
 * Each entry describes:
 *   id          - unique key used in CLI commands
 *   label       - human-friendly name
 *   description - one-line purpose
 *   tool        - which AI tool it targets
 *   outputPath  - relative path where the file is placed (may be a function(ctx) => string)
 *   generate    - function(ctx) => string  — renders the file content from project context
 *   tags        - categorisation
 */

export const TEMPLATES = [
  // ─── Anthropic Claude ────────────────────────────────────────────────────────
  {
    id: 'claude',
    label: 'CLAUDE.md',
    description: 'Top-level instructions file read by Anthropic Claude agents',
    tool: 'Claude (Anthropic)',
    outputPath: 'CLAUDE.md',
    tags: ['claude', 'anthropic', 'core'],
    generate: (ctx) => `# ${ctx.projectName}

${ctx.projectDescription}

## Project Overview

<!-- Describe what this project does, its primary purpose, and its users -->
${ctx.projectDescription}

## Architecture

<!-- Describe the high-level architecture, key components, and how they interact -->

### Tech Stack

- **Runtime**: ${ctx.runtime || 'Node.js'}
- **Language**: ${ctx.language || 'JavaScript/TypeScript'}
- **Framework**: ${ctx.framework || 'N/A'}
- **Package manager**: ${ctx.packageManager || 'npm'}

### Key Directories

\`\`\`
src/          Application source code
tests/        Test suites
docs/         Documentation
\`\`\`

## Development Commands

\`\`\`bash
# Install dependencies
${ctx.packageManager || 'npm'} install

# Run in development mode
${ctx.packageManager || 'npm'} run dev

# Run tests
${ctx.packageManager || 'npm'} test

# Lint
${ctx.packageManager || 'npm'} run lint

# Build
${ctx.packageManager || 'npm'} run build
\`\`\`

## Coding Conventions

- Follow existing code style — do not reformat files you are not editing.
- Prefer explicit over implicit; avoid clever one-liners that reduce readability.
- Keep functions small and single-purpose.
- Write tests for all new behaviour.
- Add JSDoc / TSDoc to exported functions and classes.
- Use conventional commit messages: \`feat:\`, \`fix:\`, \`chore:\`, \`docs:\`, etc.

## Testing

- Unit tests live alongside source files or in \`tests/\`.
- Run the full suite before opening a PR.
- Aim for meaningful coverage, not 100% line coverage.

## Important Notes

<!-- Add project-specific gotchas, constraints, and non-obvious decisions here -->

- <!-- e.g. "Do not modify generated files in src/generated/" -->
- <!-- e.g. "Environment variables must be declared in .env.example" -->

## External Resources

<!-- Links to relevant docs, ADRs, design docs, API specs -->
`,
  },

  // ─── GitHub Copilot ──────────────────────────────────────────────────────────
  {
    id: 'copilot',
    label: '.github/copilot-instructions.md',
    description: 'Custom instructions for GitHub Copilot (all chat modes)',
    tool: 'GitHub Copilot',
    outputPath: '.github/copilot-instructions.md',
    tags: ['copilot', 'github', 'core'],
    generate: (ctx) => `# GitHub Copilot Instructions — ${ctx.projectName}

## Project Context

${ctx.projectDescription}

**Tech stack**: ${ctx.language || 'JavaScript/TypeScript'} · ${ctx.framework || 'Node.js'} · ${ctx.packageManager || 'npm'}

## Coding Style

- Match the existing code style of the file you are editing.
- Use ${ctx.language === 'TypeScript' ? 'TypeScript strict mode — add types to all new code' : 'JSDoc to document public APIs'}.
- Prefer \`const\` over \`let\`, and avoid \`var\`.
- Use async/await rather than raw Promise chains.
- Favour named exports over default exports.
- Write self-documenting code; add comments only for non-obvious logic.

## Test Conventions

- Test files are named \`*.test.${ctx.language === 'TypeScript' ? 'ts' : 'js'}\` or \`*.spec.${ctx.language === 'TypeScript' ? 'ts' : 'js'}\`.
- Use the project's existing test framework — do not introduce new ones.
- Follow the Arrange / Act / Assert pattern.
- Mock external dependencies; do not make real network calls in unit tests.

## What to Avoid

- Do not add new dependencies without a comment explaining why.
- Do not remove existing error handling.
- Do not suggest rewrites of entire files — prefer targeted changes.
- Do not use deprecated APIs.

## Pull Request Guidance

- Keep PRs focused — one logical change per PR.
- Write a clear description explaining *why*, not just *what*.
- Reference the relevant issue number.
`,
  },

  // ─── Cursor AI ───────────────────────────────────────────────────────────────
  {
    id: 'cursor',
    label: '.cursor/rules/project.mdc',
    description: 'Cursor AI project rules (new .mdc format)',
    tool: 'Cursor',
    outputPath: '.cursor/rules/project.mdc',
    tags: ['cursor', 'core'],
    generate: (ctx) => `---
description: Project-wide rules for ${ctx.projectName}
globs:
alwaysApply: true
---

# ${ctx.projectName} — Cursor Rules

## Project

${ctx.projectDescription}

Stack: **${ctx.language || 'JavaScript/TypeScript'}** · **${ctx.framework || 'Node.js'}** · **${ctx.packageManager || 'npm'}**

## Coding Rules

- Match the existing code style of the surrounding file.
- Prefer small, pure functions with a single responsibility.
- Always handle errors explicitly — never swallow exceptions silently.
- Use \`async/await\`; avoid raw \`.then()/.catch()\` chains unless necessary for composition.
- Prefer \`const\`. Use \`let\` only when reassignment is necessary.

## File Structure

- Source code in \`src/\`
- Tests co-located or in \`tests/\`
- Documentation in \`docs/\`

## When Editing Existing Code

- Do not reformat code outside your change scope.
- Do not rename variables unless they are demonstrably misleading.
- Do not change function signatures without updating all call sites.

## Generating New Files

- New modules must include a header comment with a one-line purpose statement.
- Export only what is needed — prefer narrow public APIs.
- Every new module must have at least a smoke test.
`,
  },

  // ─── Cursor legacy .cursorrules ──────────────────────────────────────────────
  {
    id: 'cursorrules',
    label: '.cursorrules',
    description: 'Cursor AI legacy rules file (root-level)',
    tool: 'Cursor (legacy)',
    outputPath: '.cursorrules',
    tags: ['cursor', 'legacy'],
    generate: (ctx) => `# ${ctx.projectName} — Cursor Rules

## Project
${ctx.projectDescription}

Stack: ${ctx.language || 'JavaScript/TypeScript'} · ${ctx.framework || 'Node.js'}

## Style
- Match the existing style of the file being edited.
- Use async/await over Promise.then chains.
- Prefer const over let; avoid var.
- Small, single-purpose functions.
- Explicit error handling — never silently swallow errors.

## Testing
- Co-locate tests with source or place in tests/.
- Follow Arrange/Act/Assert.
- Do not make real network calls in unit tests.

## What to avoid
- Rewriting entire files when a targeted edit suffices.
- Adding dependencies without explanation.
- Removing existing error handling.
`,
  },

  // ─── Windsurf ────────────────────────────────────────────────────────────────
  {
    id: 'windsurf',
    label: '.windsurfrules',
    description: 'Windsurf AI editor rules',
    tool: 'Windsurf',
    outputPath: '.windsurfrules',
    tags: ['windsurf', 'core'],
    generate: (ctx) => `# Windsurf Rules — ${ctx.projectName}

## Project
${ctx.projectDescription}

## Language & Framework
- Language: ${ctx.language || 'JavaScript/TypeScript'}
- Framework: ${ctx.framework || 'Node.js'}
- Package manager: ${ctx.packageManager || 'npm'}

## Code Style
- Follow existing conventions in every file you touch.
- async/await preferred; explicit error handling required.
- Keep functions focused and small.
- Add types to all new code${ctx.language === 'TypeScript' ? '' : ' (JSDoc if JS)'}.

## Tests
- Write tests for every new feature and bug fix.
- Run \`${ctx.packageManager || 'npm'} test\` before suggesting a commit.

## Constraints
- Do not introduce new dependencies without justification.
- Do not change public API signatures without updating callers.
`,
  },

  // ─── AGENTS.md (OpenAI / generic agents) ─────────────────────────────────────
  {
    id: 'agents',
    label: 'AGENTS.md',
    description: 'Instructions for OpenAI Codex and other autonomous coding agents',
    tool: 'OpenAI Codex / generic agents',
    outputPath: 'AGENTS.md',
    tags: ['agents', 'openai', 'codex', 'core'],
    generate: (ctx) => `# Agent Instructions — ${ctx.projectName}

> This file provides instructions for AI coding agents (e.g., OpenAI Codex, Devin, SWE-agent).

## Repository Overview

${ctx.projectDescription}

### Tech Stack

| Aspect | Value |
|--------|-------|
| Language | ${ctx.language || 'JavaScript/TypeScript'} |
| Runtime | ${ctx.runtime || 'Node.js'} |
| Framework | ${ctx.framework || 'N/A'} |
| Package manager | ${ctx.packageManager || 'npm'} |

## Setup

\`\`\`bash
${ctx.packageManager || 'npm'} install
\`\`\`

## Running Tests

\`\`\`bash
${ctx.packageManager || 'npm'} test
\`\`\`

Always run the full test suite after making changes. A PR must not introduce new test failures.

## Linting

\`\`\`bash
${ctx.packageManager || 'npm'} run lint
\`\`\`

Fix all lint errors before submitting.

## Making Changes

1. Read the relevant source files before editing.
2. Make the smallest change that satisfies the requirement.
3. Add or update tests to cover the change.
4. Run tests and lint.
5. Summarise what you changed and why in your PR/commit message.

## Prohibited Actions

- Do NOT commit secrets, tokens, or credentials.
- Do NOT modify \`package-lock.json\` or \`yarn.lock\` unless explicitly asked to update dependencies.
- Do NOT reformat files you are not otherwise changing.
- Do NOT delete tests.

## Directory Structure

\`\`\`
src/          Source code
tests/        Tests
docs/         Documentation
\`\`\`

## Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):
\`\`\`
feat(scope): short description
fix(scope): short description
chore(scope): short description
docs(scope): short description
\`\`\`
`,
  },

  // ─── Aider ───────────────────────────────────────────────────────────────────
  {
    id: 'aider',
    label: '.aider.conf.yml + CONVENTIONS.md',
    description: 'Aider AI pair programmer config and conventions file',
    tool: 'Aider',
    outputPath: '.aider.conf.yml',
    extraFiles: [
      {
        outputPath: 'CONVENTIONS.md',
        generate: (ctx) => `# Coding Conventions — ${ctx.projectName}

> Aider will use this file as context when suggesting changes.

## Language

${ctx.language || 'JavaScript/TypeScript'} · ${ctx.runtime || 'Node.js'}

## Style Guide

- 2-space indentation.
- Single quotes for strings.
- Trailing commas in multi-line structures.
- Semicolons at end of statements.
- \`async/await\` for asynchronous code.
- Explicit return types on exported functions${ctx.language === 'TypeScript' ? '' : ' (use JSDoc)'}.

## Naming

- camelCase for variables and functions.
- PascalCase for classes and types.
- SCREAMING_SNAKE_CASE for true constants.
- Prefix private class members with \`_\` (or use \`#\` in modern JS).

## Error Handling

- Always handle Promise rejections.
- Throw typed errors, not plain strings.
- Log errors with sufficient context for debugging.

## Testing

- Framework: ${ctx.testFramework || 'Jest/vitest or built-in node:test'}
- Test files: \`*.test.js\` / \`*.spec.js\`
- One \`describe\` block per module; group related cases together.

## Commits

Conventional Commits format required: \`feat:\`, \`fix:\`, \`chore:\`, \`docs:\`, etc.
`,
      },
    ],
    tags: ['aider'],
    generate: (ctx) => `# Aider configuration
# https://aider.chat/docs/config/aider_conf.html

model: ${ctx.aiderModel || 'claude-3-5-sonnet-20241022'}
# model: gpt-4o

# Files to always load as read-only context
read:
  - CONVENTIONS.md
  - README.md

# Auto-commit AI changes
auto-commits: true
dirty-commits: true

# Git
git: true
gitignore: true

# Output
pretty: true
stream: true

# Linting after each edit (optional)
# lint-cmd: "${ctx.packageManager || 'npm'} run lint"
# test-cmd: "${ctx.packageManager || 'npm'} test"
`,
  },

  // ─── Amazon Q ────────────────────────────────────────────────────────────────
  {
    id: 'amazonq',
    label: '.amazonq/rules/project.md',
    description: 'Amazon Q Developer customisation rules',
    tool: 'Amazon Q',
    outputPath: '.amazonq/rules/project.md',
    tags: ['amazonq', 'aws'],
    generate: (ctx) => `# Amazon Q Rules — ${ctx.projectName}

## Project
${ctx.projectDescription}

## Stack
- Language: ${ctx.language || 'JavaScript/TypeScript'}
- Runtime: ${ctx.runtime || 'Node.js'}
- Framework: ${ctx.framework || 'N/A'}
- Package manager: ${ctx.packageManager || 'npm'}

## Code Style
- Follow existing conventions; do not reformat unrelated code.
- Use \`async/await\` for asynchronous logic.
- Keep functions small and focused.
- Handle all errors explicitly.

## Security
- Never hardcode credentials, tokens, or secrets.
- Validate all external input.
- Use parameterised queries for database access.
- Follow the principle of least privilege for IAM roles/permissions.

## Testing
- Write unit tests for all business logic.
- Mock AWS SDK calls in tests — do not make real AWS API calls.
- Run \`${ctx.packageManager || 'npm'} test\` before committing.
`,
  },

  // ─── Architecture docs ────────────────────────────────────────────────────────
  {
    id: 'architecture',
    label: 'docs/ARCHITECTURE.md',
    description: 'Architecture documentation (valuable context for all AI tools)',
    tool: 'All AI tools',
    outputPath: 'docs/ARCHITECTURE.md',
    tags: ['docs', 'core'],
    generate: (ctx) => `# Architecture — ${ctx.projectName}

## Overview

${ctx.projectDescription}

## System Context

<!-- A high-level diagram or prose description of where this system fits -->

## Key Components

| Component | Responsibility |
|-----------|----------------|
| <!-- e.g. API layer --> | <!-- handles HTTP requests --> |
| <!-- e.g. Service layer --> | <!-- business logic --> |
| <!-- e.g. Data layer --> | <!-- persistence --> |

## Data Flow

<!-- Describe how data moves through the system for the primary use-case -->

\`\`\`
[Input] → [Component A] → [Component B] → [Output]
\`\`\`

## Technology Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Language | ${ctx.language || 'JavaScript/TypeScript'} | <!-- reason --> |
| Framework | ${ctx.framework || 'N/A'} | <!-- reason --> |
| Database | <!-- e.g. PostgreSQL --> | <!-- reason --> |

## External Dependencies

| Dependency | Purpose |
|------------|---------|
| <!-- npm package or service --> | <!-- what it does --> |

## Non-Functional Requirements

- **Performance**: <!-- targets, e.g. p99 < 200 ms -->
- **Scalability**: <!-- horizontal / vertical scaling strategy -->
- **Availability**: <!-- SLA target -->
- **Security**: <!-- auth model, data classification -->

## Known Limitations & Trade-offs

<!-- Document deliberate trade-offs and technical debt here -->

## Future Direction

<!-- Planned improvements or roadmap items -->
`,
  },

  // ─── CONTRIBUTING.md ─────────────────────────────────────────────────────────
  {
    id: 'contributing',
    label: 'CONTRIBUTING.md',
    description: 'Contribution guide — useful context for AI agents and human contributors',
    tool: 'All AI tools',
    outputPath: 'CONTRIBUTING.md',
    tags: ['docs', 'core'],
    generate: (ctx) => `# Contributing to ${ctx.projectName}

Thank you for contributing!

## Development Setup

\`\`\`bash
git clone <repo-url>
cd ${ctx.projectSlug || ctx.projectName.toLowerCase().replace(/\s+/g, '-')}
${ctx.packageManager || 'npm'} install
\`\`\`

## Development Workflow

1. Fork the repository and create a feature branch from \`main\`.
2. Make your changes with appropriate tests.
3. Ensure all tests and linting pass.
4. Open a pull request against \`main\`.

## Branching

- \`main\` — stable, deployable at all times
- \`feat/<name>\` — new features
- \`fix/<name>\` — bug fixes
- \`chore/<name>\` — maintenance tasks

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
feat(scope): add new feature
fix(scope): fix a bug
docs(scope): update documentation
chore(scope): dependency updates
test(scope): add or update tests
refactor(scope): code refactoring without functional change
\`\`\`

## Running Tests

\`\`\`bash
${ctx.packageManager || 'npm'} test
\`\`\`

## Linting

\`\`\`bash
${ctx.packageManager || 'npm'} run lint
# Auto-fix where possible:
${ctx.packageManager || 'npm'} run lint -- --fix
\`\`\`

## Pull Request Checklist

- [ ] Tests added or updated
- [ ] All tests pass
- [ ] Linting passes
- [ ] Documentation updated if necessary
- [ ] PR description explains the *why*

## Code of Conduct

Be respectful and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).
`,
  },

  // ─── AI Skills file ──────────────────────────────────────────────────────────
  {
    id: 'skills',
    label: '.ai/skills.md',
    description: 'Declare domain skills and domain knowledge for AI agents',
    tool: 'All AI tools',
    outputPath: '.ai/skills.md',
    tags: ['skills', 'ai', 'core'],
    generate: (ctx) => `# AI Skills & Domain Knowledge — ${ctx.projectName}

> This file helps AI tools understand the domain expertise needed to work effectively in this codebase.

## Domain Overview

${ctx.projectDescription}

## Key Domain Concepts

<!-- Define domain-specific terms and concepts AI agents should understand -->

| Term | Definition |
|------|-----------|
| <!-- e.g. Settlement --> | <!-- The process of finalising financial transactions --> |
| <!-- e.g. Transfer --> | <!-- A movement of funds between two parties --> |

## Business Rules

<!-- List important business rules that should never be violated -->

- <!-- e.g. "A transfer cannot be completed without a valid quote" -->
- <!-- e.g. "Settlement windows are opened and closed by operators" -->

## Common Patterns in This Codebase

<!-- Describe recurring patterns so AI doesn't re-invent them -->

### Error Handling
\`\`\`js
// Always use the project error factory:
// throw new AppError('ERR_CODE', 'Human message', { context })
\`\`\`

### Logging
\`\`\`js
// Use the injected logger, never console.log in production code:
// logger.info({ data }, 'descriptive message')
\`\`\`

### Configuration
\`\`\`js
// Read config through the config module, not process.env directly
\`\`\`

## Integration Points

| System | Protocol | Purpose |
|--------|----------|---------|
| <!-- e.g. Kafka --> | <!-- Event streaming --> | <!-- async message bus --> |
| <!-- e.g. MySQL --> | <!-- TCP/SQL --> | <!-- primary datastore --> |

## Glossary

<!-- Technical abbreviations used in this project -->

| Abbreviation | Meaning |
|-------------|---------|
| <!-- e.g. ML --> | <!-- Mojaloop --> |
| <!-- e.g. FSP --> | <!-- Financial Service Provider --> |
`,
  },

  // ─── .ai/context.md (general AI context) ─────────────────────────────────────
  {
    id: 'context',
    label: '.ai/context.md',
    description: 'General project context document loaded by multiple AI tools',
    tool: 'All AI tools',
    outputPath: '.ai/context.md',
    tags: ['ai', 'core'],
    generate: (ctx) => `# Project Context — ${ctx.projectName}

## What is this project?

${ctx.projectDescription}

## Who uses it?

<!-- Describe the primary users/consumers of this project -->

## Repository type

${ctx.repoType || 'Application'} — ${ctx.language || 'JavaScript/TypeScript'}

## Quick Start

\`\`\`bash
${ctx.packageManager || 'npm'} install
${ctx.packageManager || 'npm'} run dev
\`\`\`

## Test

\`\`\`bash
${ctx.packageManager || 'npm'} test
\`\`\`

## Important Files

| File | Purpose |
|------|---------|
| \`src/\` | Application source |
| \`tests/\` | Test suite |
| \`docs/\` | Documentation |
| \`CLAUDE.md\` | Claude-specific instructions |
| \`AGENTS.md\` | Autonomous agent instructions |
| \`.github/copilot-instructions.md\` | Copilot instructions |

## Key Constraints

<!-- List non-negotiable constraints AI should always respect -->

- Security: never log sensitive data (passwords, tokens, PII)
- Backwards compatibility: do not break existing public API contracts
- All changes must be covered by tests
`,
  },
]

/**
 * Look up a template by its id (case-insensitive).
 */
export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id.toLowerCase() === id.toLowerCase()) ?? null
}

/**
 * Return all templates, optionally filtered by tag.
 */
export function getTemplates(tag = null) {
  if (!tag) return TEMPLATES
  return TEMPLATES.filter((t) => t.tags.includes(tag))
}
