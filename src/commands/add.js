import chalk from 'chalk'
import { join } from 'path'
import { getTemplate, TEMPLATES } from '../templates/registry.js'
import { writeFile, printFileResult, resolveCwd } from '../utils/fileWriter.js'
import { detectProjectContext } from '../utils/detectContext.js'
import inquirer from 'inquirer'

export async function addCommand(type, options) {
  const cwd = resolveCwd(options)
  const template = getTemplate(type)

  if (!template) {
    const ids = TEMPLATES.map((t) => chalk.cyan(t.id)).join(', ')
    console.error(chalk.red(`\n  ✖ Unknown template type: "${type}"\n`))
    console.error(`  Available: ${ids}\n`)
    process.exit(1)
  }

  const detected = detectProjectContext(cwd)
  let ctx = { ...detected }

  // If we can't get the name from package.json, ask
  if (!ctx.projectName) {
    const { projectName, projectDescription } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-project',
        validate: (v) => v.trim().length > 0 || 'Required',
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Short description:',
        default: 'A software project',
      },
    ])
    ctx.projectName = projectName
    ctx.projectDescription = projectDescription
  }

  console.log()
  const filePath = join(cwd, template.outputPath)
  const content = template.generate(ctx)
  const result = writeFile(filePath, content, { force: options.force })
  printFileResult(filePath, result)

  if (template.extraFiles) {
    for (const extra of template.extraFiles) {
      const extraPath = join(cwd, extra.outputPath)
      const extraContent = extra.generate(ctx)
      const extraResult = writeFile(extraPath, extraContent, { force: options.force })
      printFileResult(extraPath, extraResult)
    }
  }

  console.log()
}
