import { list, replace } from './generate'
import { Config, Subconfig } from './types'

type Replacements = Record<`#${string}#`, string | ((indent: string) => string)>
export const getReplacements = (config: Config | Subconfig): Replacements => {
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
    case 'concept':
    case 'nrel': {
      const nbhd: Replacements = {
        '#STATEMENT#': (template: string) =>
          Object.entries(config.statement)
            .map(([system, variables]) => replace(template, { type: 'statement', system, ...variables }))
            .join('\n')
      }
      return config.type === 'concept'
        ? {
            ...nbhd
          }
        : {
            ...nbhd
          }
    }
    case 'definition':
      return {}
    case 'statement':
      return {}
  }
}
