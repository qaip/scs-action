export type Config = DomainConfig

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
