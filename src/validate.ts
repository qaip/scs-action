import { load } from 'js-yaml'
import { ajv } from './validators'
import { Config } from './types'

export const parse = (text: string, fileName: string): [config: Config, path: string] => {
  const config = load(text)
  if (isConfigLike(config)) {
    type Match = [string, string, string, Config['configType']]
    const [, path, system, configType] = fileName.match(/^(.+\/)?(.+)\.(.+)\.yaml$/) as Match
    const validate = ajv.getSchema(`${configType}.schema.json`)
    if (!validate) {
      throw new Error('Invalid config type')
    }
    if (!validate(config)) {
      throw new Error(
        `[${system}.${configType}.yaml]\n${ajv.errorsText(validate.errors, {
          dataVar: configType,
          separator: '\n'
        })}`
      )
    }
    config.system = system
    config.configType = configType
    return [config, path ?? '']
  }
  throw new Error('Config is not valid')
}

export function isConfigLike(config: unknown): config is Config {
  if (typeof config !== 'object') {
    return false
  }
  return true
}
