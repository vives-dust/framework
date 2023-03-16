import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  conversionModelsDataValidator,
  conversionModelsPatchValidator,
  conversionModelsQueryValidator,
  conversionModelsResolver,
  conversionModelsExternalResolver,
  conversionModelsDataResolver,
  conversionModelsPatchResolver,
  conversionModelsQueryResolver
} from './conversionmodels.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(conversionModelsExternalResolver),
      schemaHooks.resolveResult(conversionModelsResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(conversionModelsQueryValidator),
      schemaHooks.resolveQuery(conversionModelsQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(conversionModelsDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(conversionModelsDataResolver)
    ],
    patch: [
      schemaHooks.validateData(conversionModelsPatchValidator),
      schemaHooks.resolveData(conversionModelsPatchResolver)
    ],
    remove: []
  },
  after: {
    all: []
  },
  error: {
    all: []
  }
};
