export type Config = DomainConfig | ConceptConfig | NrelConfig

interface DomainConfig {
  type: 'domain'
  system: string
  en: string
  ru: string
  parent: string
  children?: string // multiline
  max: string // multiline
  concepts: string // multiline
  rrels?: string // multiline
  nrels?: string // multiline
}

interface NeighbourhoodConfig {
  system: string
  en: string
  ru: string
  definition: {
    ru: string
    en: string
    concept: string // multiline
    nrel: string // multiline
    rrel: string // multiline
  }
  statement: {
    [system: string]: {
      ru: string
      en: string
      concept: string // multiline
      nrel: string // multiline
      rrel: string // multiline
    }
  }
}

interface ConceptConfig extends NeighbourhoodConfig {
  type: 'concept'
  max: string
}

interface NrelConfig extends NeighbourhoodConfig {
  type: 'nrel'
  arity: 2
  domains: {
    first: string
    second: string
  }
  properties: {
    symmetric: boolean
    reflexive: boolean
    transitive: boolean
  }
}
