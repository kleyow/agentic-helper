import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { join } from 'path'
import { TEMPLATES } from '../templates/registry.js'
import { writeFile, printFileResult, resolveCwd } from '../utils/fileWriter.js'
import { detectProjectContext } from '../utils/detectContext.js'

const CORE_IDS = ['claude', 'copilot', 'cursor', 'agents', 'contributing', 'skills']

export async function initCommand(options) {
  const cwd = resolveCwd(options)

  console.log()
  console.log(chalk.bold.cyan('🤖 agentic-helper init'))
  console.log(chalk.dim(`   Scaffolding AI context files in: ${cwd}`))
  console.log()

  // ── Auto-detect project context ───────────────────────────────────────────
  const detected = detectProjectContext(cwd)

  // ── Interactive prompts ───────────────────────────────────────────────────
  let ctx = { ...detected }

  if (!options.yes) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: detected.projectName || 'my-project',
        validate: (v) => v.trim().length > 0 || 'Required',
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Short description:',
        default: detected.projectDescription || 'A software project',
      },
      {
        type: 'list',
        name: 'language',
        message: 'Primary language:',
        choices: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Other'],
        default: detected.language || 'TypeScript',
      },
      {
        type: 'input',
        name: 'framework',
        message: 'Framework (leave blank if none):',
        default: detected.framework || '',
      },
      {
        type: 'list',
        name: 'packageManager',
        message: 'Package manager:',
        choices: ['npm', 'pnpm', 'yarn', 'N/A'],
        default: detected.packageManager || 'npm',
      },
      {
        type: 'checkbox',
        name: 'selectedIds',
        message: 'Which AI context files do you want to generate?',
        choices: TEMPLATES.map((t) => ({
          name: `${chalk.bold(t.label.padEnd(42))} ${chalk.dim(t.description)}`,
          value: t.id,
          checked: CORE_IDS.includes(t.id),
        })),
      },
    ])

    ctx = { ...ctx, ...answers }
  } else {
    ctx.selectedIds = CORE_IDS
    ctx.projectName = ctx.projectName || 'my-project'
    ctx.projectDescription = ctx.projectDescription || 'A software project'
  }

  const { selectedIds } = ctx
  if (!selectedIds || selectedIds.length === 0) {
    console.log(chalk.yellow('\nNo files selected. Nothing to do.\n'))
    return
  }

  console.log()
  const spinner = ora('Writing files…').start()
  spinner.stop()

  let created = 0
  let skipped = 0

  for (const id of selectedIds) {
    const template = TEMPLATES.find((t) => t.id === id)
    if (!template) continue

    const filePath = join(cwd, template.outputPath)
    const content = template.generate(ctx)
    const result = writeFile(filePath, content, { force: options.force })
    printFileResult(filePath, result)
    if (result !== 'skipped') created++
    else skipped++

    // Extra files (e.g., aider's CONVENTIONS.md)
    if (template.extraFiles) {
      for (const extra of template.extraFiles) {
        const extraPath = join(cwd, extra.outputPath)
        const extraContent = extra.generate(ctx)
        const extraResult = writeFile(extraPath, extraContent, { force: options.force })
        printFileResult(extraPath, extraResult)
        if (extraResult !== 'skipped') created++
        else skipped++
      }
    }
  }

  console.log()
  console.log(
    chalk.bold.green(`✔ Done!`) +
    `  ${chalk.green(created)} file${created !== 1 ? 's' : ''} created` +
    (skipped > 0 ? chalk.dim(`, ${skipped} skipped`) : '')
  )
  console.log()
  console.log(chalk.dim('  Tip: Open the generated files and fill in the placeholder sections.'))
  console.log(chalk.dim('  Tip: Commit these files so your whole team (and AI tools) benefit.'))
  console.log()
}
