import { test } from '@jest/globals'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { generateScsFile } from '../src/generate'
import { parse } from '../src/validate'

const testScsGeneration = (fileName: string) => {
  const fullPath = join(__dirname, fileName)
  const config = readFileSync(fullPath, { encoding: 'utf8' })
  const { name, content } = generateScsFile(...parse(config, fullPath), false)
  writeFileSync(name, content, { encoding: 'utf8' })
}

test('Concept Template', async () => {
  testScsGeneration('scs_automation.concept.yaml')
})
