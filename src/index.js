import { Command } from 'commander'
import chalk from 'chalk'
import { initCommand } from './commands/init.js'
import { addCommand } from './commands/add.js'
import { listCommand } from './commands/list.js'
import { syncCommand } from './commands/sync.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))

const program = new Command()

program
  .name('agentic-helper')
  .description(
    chalk.cyan('🤖 Scaffold and maintain AI assistant context files for your repository\n') +
    chalk.dim('  Supports Claude, Copilot, Cursor, Windsurf, Aider, Amazon Q, and more')
  )
  .version(pkg.version, '-v, --version')

program
  .command('init')
  .description('Interactive wizard to scaffold AI context files for your project')
  .option('--cwd <path>', 'target directory (defaults to current working directory)')
  .option('--yes', 'skip confirmations and use defaults')
  .action(initCommand)

program
  .command('add <type>')
  .description('Add a specific AI context file to your project')
  .option('--cwd <path>', 'target directory (defaults to current working directory)')
  .option('--force', 'overwrite existing file')
  .action(addCommand)

program
  .command('list')
  .description('List all available AI context file templates')
  .option('--json', 'output as JSON')
  .action(listCommand)

program
  .command('sync')
  .description('Check which AI context files are present and which are missing')
  .option('--cwd <path>', 'target directory (defaults to current working directory)')
  .action(syncCommand)

program.addHelpText('after', `
${chalk.bold('Examples:')}
  ${chalk.cyan('$ agh init')}               Interactive setup wizard
  ${chalk.cyan('$ agh add claude')}         Add CLAUDE.md
  ${chalk.cyan('$ agh add copilot')}        Add .github/copilot-instructions.md
  ${chalk.cyan('$ agh add cursor')}         Add .cursor/rules/project.mdc
  ${chalk.cyan('$ agh list')}               List all available templates
  ${chalk.cyan('$ agh sync')}               Check which files are present/missing

${chalk.bold('Supported AI tools:')}
  ${chalk.yellow('claude')}       Anthropic Claude — CLAUDE.md
  ${chalk.yellow('copilot')}      GitHub Copilot — .github/copilot-instructions.md
  ${chalk.yellow('cursor')}       Cursor AI — .cursor/rules/project.mdc
  ${chalk.yellow('windsurf')}     Windsurf — .windsurfrules
  ${chalk.yellow('agents')}       OpenAI Codex / generic agents — AGENTS.md
  ${chalk.yellow('aider')}        Aider — .aider.conf.yml + CONVENTIONS.md
  ${chalk.yellow('amazonq')}      Amazon Q — .amazonq/rules/project.md
  ${chalk.yellow('architecture')} Architecture docs — docs/ARCHITECTURE.md
  ${chalk.yellow('contributing')} Contribution guide — CONTRIBUTING.md
  ${chalk.yellow('skills')}       AI skills/capabilities — .ai/skills.md
`)

program.parse()
