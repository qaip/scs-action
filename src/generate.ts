import { readFileSync } from 'fs'
import { join } from 'path'
import { getReplacements } from './replacements'
import { Config, Subconfig } from './types'

const TEMPLATES = new Map<Config['configType'], string>()

export const generateScsFile = (config: Config, path: string, encode = true): { name: string; content: string } => {
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
    content: encode ? Buffer.from(scs, 'utf-8').toString('base64') : scs
  }
}

export const replace = (template: string, config: Config | Subconfig): string => {
  const replacements = getReplacements(config)
  const blockReplacer = (match: string, variable: `#${string}#`, block: string): string => {
    const replacement = replacements[variable] ?? match
    const subtemplate = block.replace(/^\+ /gm, '')
    return typeof replacement === 'function' ? replacement(subtemplate) : replacement
  }
  const lineReplacer = (_match: string, prefix: string, variable: `#${string}#`, postfix: string): string => {
    const replacement = replacements[variable] ?? variable
    return typeof replacement === 'function' ? replacement(prefix, postfix) : replacement
  }
  const replacer = (_match: string, indent: string, variable: `#${string}#`): string => {
    const replacement = replacements[variable] ?? variable
    return typeof replacement === 'function' ? replacement(indent) : indent + replacement
  }
  return template
    .replace(/^\+ \/\* (#\w+#) \*\/\n((\+ [^\n]*\n)+)/gms, blockReplacer)
    .replace(/^- (.+)(#\w+#)(.+)/gm, lineReplacer)
    .replace(/(\t*)(#\w+#)/gm, replacer)
}

export const list =
  (pre: string, values: string | undefined, semi = false) =>
  (prefix: string, postfix = ''): string => {
    if (semi) {
      postfix = postfix.replace(/;$/, '')
    }
    return values && values.trim()
      ? values
          .split('\n')
          .filter(Boolean)
          .map(value => prefix + pre + value + postfix)
          .join(`${postfix ? '' : ';'}\n`) + (semi ? ';' : '')
      : `${prefix}...${postfix}`
  }
