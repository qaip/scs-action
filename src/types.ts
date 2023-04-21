export type Config = DomainConfig | ConceptConfig | NrelConfig
export type Subconfig = DefinitionConfig | StatementConfig

interface BaseConfig {
  ru: string
  en: string
  concepts?: string // multiline
  nrels?: string // multiline
  rrels?: string // multiline
}

interface DomainConfig extends BaseConfig {
  type: 'domain'
  system: string
  parent: string
  children?: string // multiline
  max: string // multiline
}

interface NeighbourhoodConfig {
  system: string
  en: string
  ru: string
  definition: BaseConfig
  statement: {
    [system: string]: BaseConfig
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

interface DefinitionConfig {
  type: 'definition'
}

interface StatementConfig {
  type: 'statement'
  system: string
}
