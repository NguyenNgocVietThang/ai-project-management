import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const sourceRoot = path.resolve(process.cwd(), 'src')
// Brand names, identifiers and standard time units are language independent.
const identifiers = new Set(['AI.', 'AI Project', 'Google', 'CR #', 'h', 'd)'])
const examples = new Set(['name@example.com', 'https://example.com'])

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(file) : file.endsWith('.tsx') && !file.includes('.test.') ? [file] : []
  })
}

describe('localized UI copy', () => {
  it('keeps visible prose and accessibility labels in message catalogs', () => {
    const untranslated: string[] = []
    for (const file of sourceFiles(sourceRoot)) {
      const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
      function visit(node: ts.Node) {
        let text: string | undefined
        if (ts.isJsxText(node)) text = node.text.trim().replace(/\s+/g, ' ')
        if (ts.isJsxAttribute(node) && /^(title|description|label|placeholder|aria-label|eyebrow|retryLabel)$/.test(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer)) {
          text = node.initializer.text
        }
        if (text && /\p{L}/u.test(text) && !identifiers.has(text) && !examples.has(text)) {
          const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1
          untranslated.push(`${path.relative(sourceRoot, file)}:${line}: ${text}`)
        }
        ts.forEachChild(node, visit)
      }
      visit(source)
    }
    expect(untranslated).toEqual([])
  })
})
