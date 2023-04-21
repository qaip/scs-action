import { readFileSync } from 'fs'
import { join } from 'path'
import { Config, Subconfig } from './types'
import { getReplacements } from './replacements'

const TEMPLATES = new Map<Config['type'], string>()

export const generateScsFile = (config: Config, configFileName: string): { name: string; content: string } => {
  if (!TEMPLATES.has(config.type)) {
    TEMPLATES.set(config.type, readFileSync(join(__dirname, `templates/${config.type}.scs`), { encoding: 'utf8' }))
  }
  const template = TEMPLATES.get(config.type) ?? ''

  const scs = replace(template, config)
  return {
    name: getScsFileName(config, configFileName),
    content: Buffer.from(scs, 'utf-8').toString('base64')
  }
}

const getScsFileName = (config: Config, configFileName: string): string => {
  const path = configFileName.match(/^(.+\/).+$/)?.at(1) ?? ''
  switch (config.type) {
    case 'domain': {
      return `${path}${config.type}_${config.system}.scs`
    }
    case 'concept': {
      return `${path}${config.type}_${config.system}.scs`
    }
    case 'nrel': {
      return `${path}${config.type}_${config.system}.scs`
    }
  }
}

export const list =
  (prefix: string, values: string | undefined) =>
  (indent: string): string =>
    values
      ? values
          .split('\n')
          .filter(Boolean)
          .map(value => indent + prefix + value)
          .join(';\n')
      : `${indent}...`

export const replace = (template: string, config: Config | Subconfig): string => {
  const replacements = getReplacements(config)
  const replacer = (match: string, indent: string, variable: `#${string}#`): string => {
    const replacement = replacements[variable] ?? match
    return typeof replacement === 'string' ? replacement : replacement(indent)
  }
  const subtemplateReplacer = (match: string, variable: `#${string}#`, block: string): string => {
    const replacement = replacements[variable] ?? match
    const subtemplate = block.replace(/(\n|^)\+ /g, (_match: string, start: string) => start)
    return typeof replacement === 'function' ? replacement(subtemplate) : replacement
  }
  const plainTemplate = template.replace(/\+ \/\* ([^#]+) \*\/\n(.+)\n\n/s, subtemplateReplacer)
  return plainTemplate.replace(/(\t*)(#[^#]+#)/g, replacer)
}
