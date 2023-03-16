import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  conversionModelDataValidator,
  conversionModelPatchValidator,
  conversionModelQueryValidator,
  conversionModelResolver,
  conversionModelExternalResolver,
  conversionModelDataResolver,
  conversionModelPatchResolver,
  conversionModelQueryResolver
} from './conversionmodels.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(conversionModelExternalResolver),
      schemaHooks.resolveResult(conversionModelResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(conversionModelQueryValidator),
      schemaHooks.resolveQuery(conversionModelQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(conversionModelDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(conversionModelDataResolver)
    ],
    patch: [
      schemaHooks.validateData(conversionModelPatchValidator),
      schemaHooks.resolveData(conversionModelPatchResolver)
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
