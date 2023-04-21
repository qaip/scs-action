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
  definition: Omit<DefinitionConfig, 'type' | 'system'>
  statement: {
    [system: string]: Omit<StatementConfig, 'type' | 'system'>
  }
}

interface ConceptConfig extends NeighbourhoodConfig {
  type: 'concept'
  max: string
}

interface NrelConfig extends NeighbourhoodConfig {
  type: 'nrel'
  arity: 2
  domains: `${string} -> ${string}`
  properties: {
    symmetric: boolean
    reflexive: boolean
    transitive: boolean
  }
}

interface DefinitionConfig extends BaseConfig {
  type: 'definition'
  value_ru: string
  value_en: string
}

interface StatementConfig extends BaseConfig {
  type: 'statement'
  system: string
  value_ru: string
  value_en: string
}
