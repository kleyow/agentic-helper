import { existsSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'
import { TEMPLATES } from '../templates/registry.js'
import { resolveCwd } from '../utils/fileWriter.js'

export function syncCommand(options) {
  const cwd = resolveCwd(options)

  console.log()
  console.log(chalk.bold('  AI context file status'))
  console.log(chalk.dim(`  Directory: ${cwd}`))
  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────'))

  let present = 0
  let missing = 0

  for (const t of TEMPLATES) {
    const filePath = join(cwd, t.outputPath)
    const exists = existsSync(filePath)

    // For templates with extra files, check the primary one only
    const status = exists
      ? chalk.green('  ✔ present ')
      : chalk.dim('  – missing ')

    const label = exists
      ? chalk.white(t.label.padEnd(42))
      : chalk.dim(t.label.padEnd(42))

    const hint = exists
      ? chalk.dim(t.outputPath)
      : chalk.dim(`run: agh add ${t.id}`)

    console.log(`${status}${label} ${hint}`)

    if (exists) present++
    else missing++
  }

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────'))
  console.log(
    `  ${chalk.green(present + ' present')}  ${missing > 0 ? chalk.yellow(missing + ' missing') : chalk.dim(missing + ' missing')}`
  )
  console.log()

  if (missing > 0) {
    console.log(chalk.dim('  Run `agh init` to add all missing files interactively,'))
    console.log(chalk.dim('  or `agh add <id>` to add a specific file.\n'))
  } else {
    console.log(chalk.green('  All AI context files are present! 🎉\n'))
  }
}
