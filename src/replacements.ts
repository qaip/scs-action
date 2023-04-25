import { list, replace } from './generate'
import { Config, Subconfig } from './types'

type Replacements = Record<`#${string}#`, string | ((prefix: string, postfix?: string) => string)>
export const getReplacements = (config: Config | Subconfig): Replacements => {
  const toArray = (value: string | string[]): string[] => (typeof value === 'string' ? value.split(' | ') : value)
  switch (config.configType) {
    case 'domain': {
      return {
        '#SYSTEM#': config.system,
        '#RU#': config.ru,
        '#EN#': config.en,
        '#PARENT#': config.parent,
        '#CHILDREN#': list(config.children),
        '#MAX#': list(config.max),
        '#CONCEPTS#': list(config.concepts),
        '#NRELS#': list(config.nrels),
        '#RRELS#': list(config.rrels),
        '#ATOMIC#': config.children ? 'non_atomic' : 'atomic'
      }
    }
    case 'concept':
    case 'nrel': {
      const statements = config.statement ? Object.entries(config.statement) : []
      const nbhd: Replacements = {
        '#SYSTEM#': config.system,
        '#RU#': toArray(config.ru)[0],
        '#EN#': toArray(config.en)[0],
        '#RU_ALT#': list(toArray(config.ru).slice(1).join('\n')),
        '#EN_ALT#': list(toArray(config.en).slice(1).join('\n')),
        '#DEFINITION_RU#': list(toArray(config.definition.ru).join('\n')),
        '#DEFINITION_EN#': list(toArray(config.definition.en).join('\n')),
        '#DEFINITION_CONCEPTS#': list(config.definition.using.concepts),
        '#DEFINITION_NRELS#': list(config.definition.using.nrels),
        '#DEFINITION_RRELS#': list(config.definition.using.rrels),
        '#STATEMENT#': template =>
          config.statement
            ? statements
                .map(([system, variables]) => replace(template, { configType: 'statement', system, ...variables }))
                .join('\n')
            : '',
        '#STATEMENT_CONCEPTS_ALL#': list(statements.map(statement => statement[1].using.concepts).join('\n')),
        '#STATEMENT_NRELS_ALL#': list(statements.map(statement => statement[1].using.nrels).join('\n')),
        '#STATEMENT_RRELS_ALL#': list(statements.map(statement => statement[1].using.rrels).join('\n'))
      }
      return config.configType === 'concept' ? { ...nbhd, '#PARENT#': list(config.parent) } : { ...nbhd }
    }
    case 'statement':
      return {
        '#STATEMENT_SYSTEM#': config.system,
        '#STATEMENT_RU#': list(toArray(config.ru).join('\n')),
        '#STATEMENT_EN#': list(toArray(config.en).join('\n')),
        '#STATEMENT_TITLE_RU#': config.title.ru,
        '#STATEMENT_TITLE_EN#': config.title.en,
        '#STATEMENT_CONCEPTS#': list(config.using.concepts),
        '#STATEMENT_NRELS#': list(config.using.nrels),
        '#STATEMENT_RRELS#': list(config.using.rrels)
      }
  }
}
