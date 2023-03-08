import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  sensorTypesDataValidator,
  sensorTypesPatchValidator,
  sensorTypesQueryValidator,
  sensorTypesResolver,
  sensorTypesExternalResolver,
  sensorTypesDataResolver,
  sensorTypesPatchResolver,
  sensorTypesQueryResolver
} from './sensortypes.schema'

import { inject_nano_id } from '../../hooks/inject-nanoid'
import { set_timestamps } from '../../hooks/timestamps'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(sensorTypesExternalResolver),
      schemaHooks.resolveResult(sensorTypesResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(sensorTypesQueryValidator),
      schemaHooks.resolveQuery(sensorTypesQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(sensorTypesDataValidator),
      inject_nano_id,
      set_timestamps,
      schemaHooks.resolveData(sensorTypesDataResolver)
    ],
    patch: [
      schemaHooks.validateData(sensorTypesPatchValidator),
      set_timestamps,
      schemaHooks.resolveData(sensorTypesPatchResolver)
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
