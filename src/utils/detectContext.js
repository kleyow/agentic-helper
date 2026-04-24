import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

/**
 * Auto-detect project context from common config files in cwd.
 * Returns a partial ProjectContext object.
 */
export function detectProjectContext(cwd) {
  const ctx = {}

  // package.json
  const pkgPath = join(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      ctx.projectName = pkg.name || ''
      ctx.projectDescription = pkg.description || ''
      ctx.projectSlug = pkg.name || ''

      // Detect TypeScript
      if (
        pkg.devDependencies?.typescript ||
        pkg.dependencies?.typescript ||
        existsSync(join(cwd, 'tsconfig.json'))
      ) {
        ctx.language = 'TypeScript'
      } else {
        ctx.language = 'JavaScript'
      }

      // Detect framework
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }
      if (allDeps.express) ctx.framework = 'Express'
      else if (allDeps.fastify) ctx.framework = 'Fastify'
      else if (allDeps.next) ctx.framework = 'Next.js'
      else if (allDeps.react) ctx.framework = 'React'
      else if (allDeps.vue) ctx.framework = 'Vue'
      else if (allDeps.hapi || allDeps['@hapi/hapi']) ctx.framework = 'Hapi'
      else if (allDeps.koa) ctx.framework = 'Koa'

      // Detect test framework
      if (allDeps.jest || allDeps['@jest/core']) ctx.testFramework = 'Jest'
      else if (allDeps.vitest) ctx.testFramework = 'Vitest'
      else if (allDeps.mocha) ctx.testFramework = 'Mocha'
      else if (allDeps.tap) ctx.testFramework = 'node-tap'

      // Detect package manager from lockfiles
      if (existsSync(join(cwd, 'yarn.lock'))) ctx.packageManager = 'yarn'
      else if (existsSync(join(cwd, 'pnpm-lock.yaml'))) ctx.packageManager = 'pnpm'
      else ctx.packageManager = 'npm'
    } catch {
      // ignore parse errors
    }
  }

  // Detect repo type heuristics
  if (existsSync(join(cwd, 'Dockerfile')) || existsSync(join(cwd, 'docker-compose.yml'))) {
    ctx.repoType = 'Service / Docker application'
  } else if (ctx.projectName?.endsWith('-lib') || ctx.projectName?.endsWith('-sdk')) {
    ctx.repoType = 'Library / SDK'
  } else {
    ctx.repoType = 'Application'
  }

  ctx.runtime = 'Node.js'

  return ctx
}
