import { load } from 'js-yaml'
import { Config } from './types'

export const parse = (text: string, fileName: string): [xonfig: Config, path: string] => {
  const config = load(text)
  if (isConfig(config)) {
    type Match = [string, string, string, Config['configType']]
    const [, path, system, configType] = fileName.match(/^(.+\/)?(.+)\.(.+)\.ya?ml$/) as Match
    config.system = system
    config.configType = configType
    return [config, path ?? '']
  }
  throw new Error('Config is not valid. why?')
}

// Validate here (add a package that uses reflex-metadata to validate object based on type defintions)
export function isConfig(config: unknown): config is Config {
  if (typeof config !== 'object') {
    throw new Error('config is not valid')
  }
  return true
}
