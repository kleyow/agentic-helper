import { mkdirSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { detectProjectContext } from '../../src/utils/detectContext.js'

function makeTmpDir() {
  const dir = join(tmpdir(), `agh-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  mkdirSync(dir, { recursive: true })
  return dir
}

function writeJson(dir, filename, data) {
  writeFileSync(join(dir, filename), JSON.stringify(data), 'utf8')
}

describe('detectProjectContext()', () => {
  let tmpDir

  beforeEach(() => {
    tmpDir = makeTmpDir()
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  test('returns an object when no package.json exists', () => {
    const ctx = detectProjectContext(tmpDir)
    expect(typeof ctx).toBe('object')
    expect(ctx.runtime).toBe('Node.js')
  })

  test('reads name and description from package.json', () => {
    writeJson(tmpDir, 'package.json', {
      name: 'my-service',
      description: 'Does stuff',
    })
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.projectName).toBe('my-service')
    expect(ctx.projectDescription).toBe('Does stuff')
    expect(ctx.projectSlug).toBe('my-service')
  })

  test('detects TypeScript via devDependencies', () => {
    writeJson(tmpDir, 'package.json', {
      name: 'ts-app',
      devDependencies: { typescript: '^5.0.0' },
    })
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.language).toBe('TypeScript')
  })

  test('detects TypeScript via tsconfig.json presence', () => {
    writeJson(tmpDir, 'package.json', { name: 'ts-app' })
    writeFileSync(join(tmpDir, 'tsconfig.json'), '{}')
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.language).toBe('TypeScript')
  })

  test('defaults to JavaScript when no typescript indicator found', () => {
    writeJson(tmpDir, 'package.json', { name: 'js-app' })
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.language).toBe('JavaScript')
  })

  test.each([
    ['express', 'Express'],
    ['fastify', 'Fastify'],
    ['next', 'Next.js'],
    ['react', 'React'],
    ['vue', 'Vue'],
    ['koa', 'Koa'],
  ])('detects %s framework', (pkg, expectedFramework) => {
    writeJson(tmpDir, 'package.json', {
      name: 'app',
      dependencies: { [pkg]: '*' },
    })
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.framework).toBe(expectedFramework)
  })

  test.each([
    ['jest', 'Jest'],
    ['vitest', 'Vitest'],
    ['mocha', 'Mocha'],
  ])('detects test framework %s', (pkg, expected) => {
    writeJson(tmpDir, 'package.json', {
      name: 'app',
      devDependencies: { [pkg]: '*' },
    })
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.testFramework).toBe(expected)
  })

  test('detects yarn via yarn.lock', () => {
    writeJson(tmpDir, 'package.json', { name: 'app' })
    writeFileSync(join(tmpDir, 'yarn.lock'), '')
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.packageManager).toBe('yarn')
  })

  test('detects pnpm via pnpm-lock.yaml', () => {
    writeJson(tmpDir, 'package.json', { name: 'app' })
    writeFileSync(join(tmpDir, 'pnpm-lock.yaml'), '')
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.packageManager).toBe('pnpm')
  })

  test('falls back to npm when no lock file present', () => {
    writeJson(tmpDir, 'package.json', { name: 'app' })
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.packageManager).toBe('npm')
  })

  test('detects Docker-based repo type', () => {
    writeJson(tmpDir, 'package.json', { name: 'app' })
    writeFileSync(join(tmpDir, 'Dockerfile'), '')
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.repoType).toContain('Docker')
  })

  test('detects library repo from name suffix', () => {
    writeJson(tmpDir, 'package.json', { name: 'my-cool-lib' })
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.repoType).toContain('Library')
  })

  test('defaults to Application repo type', () => {
    writeJson(tmpDir, 'package.json', { name: 'my-app' })
    const ctx = detectProjectContext(tmpDir)
    expect(ctx.repoType).toBe('Application')
  })

  test('handles malformed package.json gracefully', () => {
    writeFileSync(join(tmpDir, 'package.json'), '{ not valid json !!!')
    expect(() => detectProjectContext(tmpDir)).not.toThrow()
  })
})
