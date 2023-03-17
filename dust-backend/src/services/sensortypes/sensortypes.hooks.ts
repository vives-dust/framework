import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  sensorTypeDataValidator,
  sensorTypePatchValidator,
  sensorTypeQueryValidator,
  sensorTypeResolver,
  sensorTypeExternalResolver,
  sensorTypeDataResolver,
  sensorTypePatchResolver,
  sensorTypeQueryResolver
} from './sensortypes.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(sensorTypeExternalResolver),
      schemaHooks.resolveResult(sensorTypeResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(sensorTypeQueryValidator),
      schemaHooks.resolveQuery(sensorTypeQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(sensorTypeDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(sensorTypeDataResolver)
    ],
    patch: [
      schemaHooks.validateData(sensorTypePatchValidator),
      schemaHooks.resolveData(sensorTypePatchResolver)
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
