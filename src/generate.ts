import { readFileSync } from 'fs'
import { join } from 'path'
import { Config } from './types'

const TEMPLATES = new Map<Config['type'], string>()

export const generateScsFile = (config: Config, configFileName: string): { name: string; content: string } => {
  if (!TEMPLATES.has(config.type)) {
    TEMPLATES.set(config.type, readFileSync(join(__dirname, `templates/${config.type}.scs`), { encoding: 'utf8' }))
  }
  const template = TEMPLATES.get(config.type) ?? ''

  const replacements = getReplacements(config)

  const replacer = (match: string, indent: string, variable: `#${string}#`): string => {
    const replacement = replacements[variable] ?? match
    return typeof replacement === 'string' ? replacement : replacement(indent)
  }

  const scs = template.replace(/(\t*)(#[^#]+#)/g, replacer)
  return {
    name: getScsFileName(config, configFileName),
    content: Buffer.from(scs, 'utf-8').toString('base64')
  }
}

const getScsFileName = (config: Config, configFileName: string): string => {
  const path = configFileName.match(/^(.+\/).+$/)?.at(1) ?? ''
  switch (config.type) {
    case 'domain': {
      return `${path}domain_${config.system}.scs`
    }
  }
}

type Replacements = Record<`#${string}#`, string | ((indent: string) => string)>
const getReplacements = (config: Config): Replacements => {
  switch (config.type) {
    case 'domain': {
      return {
        '#SYSTEM#': config.system,
        '#RU#': config.ru,
        '#EN#': config.en,
        '#PARENT#': config.parent,
        '#CHILDREN#': list('subject_domain_of_', config.children),
        '#SECTION_CHILDREN#': list('section_subject_domain_of_', config.children),
        '#MAX#': list('concept_', config.max),
        '#CONCEPTS#': list('concept_', config.concepts),
        '#RRELS#': list('rrel_', config.rrels),
        '#NRELS#': list('nrel_', config.nrels),
        '#ATOMIC#': config.children ? 'non_atomic' : 'atomic'
      }
    }
  }
}

const list =
  (prefix: string, values: string | undefined) =>
  (indent: string): string =>
    values
      ? values
          .split('\n')
          .filter(Boolean)
          .map(value => indent + prefix + value)
          .join(';\n')
      : `${indent}...`
