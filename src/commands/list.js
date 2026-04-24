import chalk from 'chalk'
import { TEMPLATES } from '../templates/registry.js'

export function listCommand(options) {
  if (options.json) {
    const out = TEMPLATES.map(({ id, label, description, tool, outputPath, tags }) => ({
      id, label, description, tool, outputPath, tags,
    }))
    console.log(JSON.stringify(out, null, 2))
    return
  }

  console.log()
  console.log(chalk.bold('  Available AI context file templates'))
  console.log(chalk.dim('  ────────────────────────────────────────────────────────────────'))
  console.log(
    chalk.dim('  ' + 'ID'.padEnd(16) + 'File'.padEnd(44) + 'Tool')
  )
  console.log(chalk.dim('  ────────────────────────────────────────────────────────────────'))

  for (const t of TEMPLATES) {
    console.log(
      '  ' +
      chalk.cyan(t.id.padEnd(16)) +
      chalk.white(t.label.padEnd(44)) +
      chalk.dim(t.tool)
    )
    console.log('  ' + ' '.repeat(16) + chalk.dim(t.description))
    console.log()
  }

  console.log(chalk.dim('  Use `agh add <id>` to add a single file, or `agh init` for an interactive setup.\n'))
}
