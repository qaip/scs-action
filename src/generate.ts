import { readFileSync } from 'fs'
import { join } from 'path'
import { getReplacements } from './replacements'
import { Config, Subconfig } from './types'

const TEMPLATES = new Map<Config['configType'], string>()

export const generateScsFile = (config: Config, path: string): { name: string; content: string } => {
  if (!TEMPLATES.has(config.configType)) {
    TEMPLATES.set(
      config.configType,
      readFileSync(join(__dirname, `templates/${config.configType}.scs`), { encoding: 'utf8' })
    )
  }
  const template = TEMPLATES.get(config.configType) ?? ''

  const scs = replace(template, config)
  return {
    name: `${path}${config.configType}_${config.system}.scs`,
    content: Buffer.from(scs, 'utf-8').toString('base64')
  }
}

export const replace = (template: string, config: Config | Subconfig): string => {
  const replacements = getReplacements(config)
  const blockReplacer = (match: string, variable: `#${string}#`, block: string): string => {
    const replacement = replacements[variable] ?? match
    const subtemplate = block.replace(/^\+ /gm, '')
    return typeof replacement === 'function' ? replacement(subtemplate) : replacement
  }
  const lineReplacer = (match: string, prefix: string, variable: `#${string}#`, postfix: string): string => {
    if (variable === '#END#') return match
    const replacement = replacements[variable] ?? variable
    return typeof replacement === 'function' ? replacement(prefix, postfix) : replacement
  }
  const replacer = (_match: string, indent: string, variable: `#${string}#`): string => {
    const replacement = replacements[variable] ?? variable
    return typeof replacement === 'function' ? replacement(indent) : indent + replacement
  }
  return template
    .replace(/^\+ \/\* (#\w+#) \*\/\n((\+ [^\n]*\n)+)/gms, blockReplacer)
    .replace(/^- (.*)(#\w+#)(.*)\n/gm, lineReplacer)
    .replace(/(\t*)(#\w+#)/gm, replacer)
    .replace(/(^\n(\? .*\n)+(- .*\n)?($|\*))|(^\? )/gm, '$4')
    .replace(/;*\n*- \t*#END#/g, '')
}

export const list =
  (values: string | undefined) =>
  (prefix: string, postfix = ''): string => {
    return values && values.trim()
      ? `${values
          .split('\n')
          .filter(Boolean)
          .map(value => prefix + value + postfix)
          .join(`${postfix ? '' : ';'}\n`)}\n`
      : ''
  }
