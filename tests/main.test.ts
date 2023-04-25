import { test } from '@jest/globals'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'
import { generateScsFile } from '../src/generate'
import { parse } from '../src/validate'

rmSync(`${__dirname}/.actual`, { recursive: true, force: true })
mkdirSync(`${__dirname}/.actual`)

const testScsGeneration = (fileName: string): void => {
  const fullPath = join(`${__dirname}`, fileName)
  const config = readFileSync(fullPath, { encoding: 'utf8' })
  try {
    const { name, content } = generateScsFile(...parse(config, fullPath))
    const scs = Buffer.from(content, 'base64').toString('utf-8')
    writeFileSync(name.replace(/([^/]+)$/, '.actual/$1'), scs, { encoding: 'utf8' })
    if (process.argv[2] !== 'dev') {
      const expected = readFileSync(name.replace(/([^/]+)$/, 'expect/$1'), { encoding: 'utf8' })
      expect(scs).toBe(expected)
    }
  } catch (e) {
    throw e
  }
}

test('Concept Template', async () => {
  testScsGeneration('scs_automation.concept.yaml')
})

test('Domain Template', async () => {
  testScsGeneration('ostis_automation.domain.yaml')
})
