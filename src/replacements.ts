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
        '#STATEMENT#': template =>
          Object.entries(config.statement)
            .map(([system, variables]) => replace(template, { type: 'statement', system, ...variables }))
            .join('\n')
      }
      return config.type === 'concept'
        ? {
            ...nbhd,
            '#MAX#': config.max
          }
        : {
            ...nbhd
          }
    }
    case 'definition':
      return {
        '#DEFINITION_RU#': config.ru,
        '#DEFINITION_EN#': config.en,
        '#DEFINITION_VALUE_RU#': config.value_ru,
        '#DEFINITION_VALUE_EN#': config.value_en,
        '#DEFINITION_CONCEPTS#': list('concept_', config.concepts),
        '#DEFINITION_NRELS#': list('concept_', config.nrels),
        '#DEFINITION_RRELS#': list('concept_', config.rrels)
      }
    case 'statement':
      return {
        '#STATEMENT_SYSTEM#': config.system,
        '#STATEMENT_RU#': config.ru,
        '#STATEMENT_EN#': config.en,
        '#STATEMENT_VALUE_RU#': config.value_ru,
        '#STATEMENT_VALUE_EN#': config.value_en,
        '#STATEMENT_CONCEPTS#': list('concept_', config.concepts),
        '#STATEMENT_NRELS#': list('concept_', config.nrels),
        '#STATEMENT_RRELS#': list('concept_', config.rrels)
      }
  }
}
