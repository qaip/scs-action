import { list } from './generate'
import { Config } from './types'

type Replacements = Record<`#${string}#`, string | ((indent: string) => string)>
export const getReplacements = (config: Config): Replacements => {
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
