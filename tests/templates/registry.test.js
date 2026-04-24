import { TEMPLATES, getTemplate, getTemplates } from '../../src/templates/registry.js'

describe('registry', () => {
  // ── TEMPLATES array ──────────────────────────────────────────────────────────
  describe('TEMPLATES', () => {
    test('contains at least one template', () => {
      expect(TEMPLATES.length).toBeGreaterThan(0)
    })

    test('every template has the required fields', () => {
      for (const t of TEMPLATES) {
        expect(typeof t.id).toBe('string')
        expect(t.id.length).toBeGreaterThan(0)
        expect(typeof t.label).toBe('string')
        expect(typeof t.description).toBe('string')
        expect(typeof t.tool).toBe('string')
        expect(typeof t.outputPath).toBe('string')
        expect(typeof t.generate).toBe('function')
        expect(Array.isArray(t.tags)).toBe(true)
      }
    })

    test('all ids are unique', () => {
      const ids = TEMPLATES.map((t) => t.id)
      const unique = new Set(ids)
      expect(unique.size).toBe(ids.length)
    })

    test('all outputPaths are unique', () => {
      const paths = TEMPLATES.map((t) => t.outputPath)
      const unique = new Set(paths)
      expect(unique.size).toBe(paths.length)
    })

    test('all outputPaths are relative (no leading slash)', () => {
      for (const t of TEMPLATES) {
        expect(t.outputPath.startsWith('/')).toBe(false)
      }
    })
  })

  // ── getTemplate ──────────────────────────────────────────────────────────────
  describe('getTemplate()', () => {
    test('finds a template by exact id', () => {
      const t = getTemplate('claude')
      expect(t).not.toBeNull()
      expect(t.id).toBe('claude')
    })

    test('is case-insensitive', () => {
      expect(getTemplate('CLAUDE')).not.toBeNull()
      expect(getTemplate('Claude')).not.toBeNull()
    })

    test('returns null for an unknown id', () => {
      expect(getTemplate('does-not-exist')).toBeNull()
    })

    test('finds every registered template by its own id', () => {
      for (const t of TEMPLATES) {
        expect(getTemplate(t.id)).toBe(t)
      }
    })
  })

  // ── getTemplates ─────────────────────────────────────────────────────────────
  describe('getTemplates()', () => {
    test('returns all templates when called without a tag', () => {
      expect(getTemplates()).toHaveLength(TEMPLATES.length)
    })

    test('filters by tag', () => {
      const results = getTemplates('core')
      expect(results.length).toBeGreaterThan(0)
      for (const t of results) {
        expect(t.tags).toContain('core')
      }
    })

    test('returns an empty array for an unknown tag', () => {
      expect(getTemplates('no-such-tag')).toHaveLength(0)
    })
  })

  // ── Template generate() ───────────────────────────────────────────────────────
  describe('generate()', () => {
    const ctx = {
      projectName: 'Test Project',
      projectDescription: 'A test project',
      language: 'TypeScript',
      framework: 'Express',
      packageManager: 'npm',
      runtime: 'Node.js',
    }

    test.each(TEMPLATES.map((t) => [t.id, t]))(
      '%s — generate() returns a non-empty string',
      (_id, template) => {
        const output = template.generate(ctx)
        expect(typeof output).toBe('string')
        expect(output.length).toBeGreaterThan(0)
      }
    )

    // aider's primary output is a YAML config — the project name lives in the
    // companion CONVENTIONS.md extra file, not in .aider.conf.yml itself.
    const TEMPLATES_WITH_PROJECT_NAME = TEMPLATES.filter((t) => t.id !== 'aider')

    test.each(TEMPLATES_WITH_PROJECT_NAME.map((t) => [t.id, t]))(
      '%s — generate() includes the project name',
      (_id, template) => {
        const output = template.generate(ctx)
        expect(output).toContain('Test Project')
      }
    )

    test('aider — extra file (CONVENTIONS.md) includes the project name', () => {
      const template = getTemplate('aider')
      const conventions = template.extraFiles[0].generate(ctx)
      expect(conventions).toContain('Test Project')
    })

    test('claude — generate() includes all tech-stack fields', () => {
      const template = getTemplate('claude')
      const output = template.generate(ctx)
      expect(output).toContain('TypeScript')
      expect(output).toContain('Express')
      expect(output).toContain('npm')
    })

    test('agents — generate() includes setup and test commands', () => {
      const template = getTemplate('agents')
      const output = template.generate(ctx)
      expect(output).toContain('npm install')
      expect(output).toContain('npm test')
    })

    test('aider — generate() includes extra files array', () => {
      const template = getTemplate('aider')
      expect(Array.isArray(template.extraFiles)).toBe(true)
      expect(template.extraFiles.length).toBeGreaterThan(0)
      const extra = template.extraFiles[0]
      expect(typeof extra.outputPath).toBe('string')
      expect(typeof extra.generate).toBe('function')
      const extraContent = extra.generate(ctx)
      expect(typeof extraContent).toBe('string')
      expect(extraContent.length).toBeGreaterThan(0)
    })

    test('cursor — generate() produces valid YAML-ish frontmatter block', () => {
      const template = getTemplate('cursor')
      const output = template.generate(ctx)
      expect(output).toMatch(/^---/)
      expect(output).toContain('alwaysApply: true')
    })
  })
})
