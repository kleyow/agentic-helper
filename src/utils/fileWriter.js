import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { dirname, join, resolve } from 'path'
import chalk from 'chalk'

/**
 * Write a file to disk, creating directories as needed.
 * Returns 'created' | 'skipped' | 'overwritten'
 */
export function writeFile(targetPath, content, { force = false, dryRun = false } = {}) {
  const abs = resolve(targetPath)
  const dir = dirname(abs)

  if (existsSync(abs) && !force) {
    return 'skipped'
  }

  const wasExisting = existsSync(abs)

  if (!dryRun) {
    mkdirSync(dir, { recursive: true })
    writeFileSync(abs, content, 'utf8')
  }

  return wasExisting ? 'overwritten' : 'created'
}

/**
 * Read a file from disk, returning null if it does not exist.
 */
export function readFile(targetPath) {
  const abs = resolve(targetPath)
  if (!existsSync(abs)) return null
  return readFileSync(abs, 'utf8')
}

/**
 * Print the result of a file write operation with colour.
 */
export function printFileResult(filePath, result) {
  const rel = filePath.replace(process.cwd() + '/', '')
  switch (result) {
    case 'created':
      console.log(`  ${chalk.green('✔')} ${chalk.bold('created')}    ${rel}`)
      break
    case 'overwritten':
      console.log(`  ${chalk.yellow('↺')} ${chalk.bold('overwritten')} ${rel}`)
      break
    case 'skipped':
      console.log(`  ${chalk.dim('–')} ${chalk.dim('skipped')}    ${rel} ${chalk.dim('(already exists, use --force to overwrite)')}`)
      break
  }
}

/**
 * Resolve the working directory from CLI options.
 */
export function resolveCwd(options) {
  return options.cwd ? resolve(options.cwd) : process.cwd()
}
