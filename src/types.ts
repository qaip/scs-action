export type Config = DomainConfig | ConceptConfig | NrelConfig
export type Subconfig = StatementConfig

interface Identifiers<T = string | string[]> {
  ru: T
  en: T
}

interface Nodes {
  concepts?: string // multiline
  nrels?: string // multiline
  rrels?: string // multiline
}

interface DomainConfig extends Identifiers<string>, Nodes {
  configType: 'domain'
  system: string
  parent: string
  children?: string // multiline
  max: string // multiline
}

interface NeighbourhoodConfig extends Identifiers {
  system: string
  definition: Identifiers & {
    using?: Nodes
  }
  statement?: {
    [system: string]: Omit<StatementConfig, 'configType' | 'system'>
  }
}

interface ConceptConfig extends NeighbourhoodConfig {
  configType: 'concept'
  parent?: string
}

interface NrelConfig extends NeighbourhoodConfig {
  configType: 'nrel'
  arity: 2
  domains: `${string} -> ${string}`
  properties: {
    symmetric: boolean
    reflexive: boolean
    transitive: boolean
  }
}

interface StatementConfig extends Identifiers {
  configType: 'statement'
  system: string
  title: Identifiers<string>
  using?: Nodes
}

export const configTypes: Config['configType'][] = ['concept', 'domain']
