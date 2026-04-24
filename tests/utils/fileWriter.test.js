import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { writeFile, readFile, resolveCwd } from '../../src/utils/fileWriter.js'

function makeTmpDir() {
  const dir = join(tmpdir(), `agh-fw-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  mkdirSync(dir, { recursive: true })
  return dir
}

describe('writeFile()', () => {
  let tmpDir

  beforeEach(() => {
    tmpDir = makeTmpDir()
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  test('creates a new file and returns "created"', () => {
    const target = join(tmpDir, 'hello.txt')
    const result = writeFile(target, 'hello world')
    expect(result).toBe('created')
    expect(readFileSync(target, 'utf8')).toBe('hello world')
  })

  test('creates nested directories automatically', () => {
    const target = join(tmpDir, 'a', 'b', 'c', 'file.md')
    writeFile(target, '# hi')
    expect(existsSync(target)).toBe(true)
  })

  test('skips an existing file without force and returns "skipped"', () => {
    const target = join(tmpDir, 'existing.txt')
    writeFileSync(target, 'original')
    const result = writeFile(target, 'new content')
    expect(result).toBe('skipped')
    expect(readFileSync(target, 'utf8')).toBe('original')
  })

  test('overwrites an existing file with force=true and returns "overwritten"', () => {
    const target = join(tmpDir, 'existing.txt')
    writeFileSync(target, 'original')
    const result = writeFile(target, 'new content', { force: true })
    expect(result).toBe('overwritten')
    expect(readFileSync(target, 'utf8')).toBe('new content')
  })

  test('dry run does not write the file and returns "created"', () => {
    const target = join(tmpDir, 'ghost.txt')
    const result = writeFile(target, 'should not appear', { dryRun: true })
    expect(result).toBe('created')
    expect(existsSync(target)).toBe(false)
  })

  test('dry run on existing file returns "skipped" (without force)', () => {
    const target = join(tmpDir, 'real.txt')
    writeFileSync(target, 'data')
    const result = writeFile(target, 'new', { dryRun: true })
    expect(result).toBe('skipped')
  })
})

describe('readFile()', () => {
  let tmpDir

  beforeEach(() => {
    tmpDir = makeTmpDir()
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  test('returns file contents for an existing file', () => {
    const target = join(tmpDir, 'data.txt')
    writeFileSync(target, 'some content')
    expect(readFile(target)).toBe('some content')
  })

  test('returns null for a non-existent file', () => {
    expect(readFile(join(tmpDir, 'nope.txt'))).toBeNull()
  })
})

describe('resolveCwd()', () => {
  test('returns process.cwd() when options.cwd is not set', () => {
    expect(resolveCwd({})).toBe(process.cwd())
  })

  test('resolves the provided path', () => {
    const resolved = resolveCwd({ cwd: '/tmp' })
    expect(resolved).toBe('/tmp')
  })
})
