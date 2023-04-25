import Ajv from 'ajv'

import * as baseSchema from '../schemas/base.schema.json'
import * as domainSchema from '../schemas/domain.schema.json'
import * as conceptSchema from '../schemas/concept.schema.json'

const ajv = new Ajv({ allErrors: true })

ajv.addSchema(baseSchema, 'base.schema.json')
ajv.addSchema(domainSchema, 'domain.schema.json')
ajv.addSchema(conceptSchema, 'concept.schema.json')

export { ajv }
