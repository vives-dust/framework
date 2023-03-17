import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  sensorDataValidator,
  sensorPatchValidator,
  sensorQueryValidator,
  sensorResolver,
  sensorExternalResolver,
  sensorDataResolver,
  sensorPatchResolver,
  sensorQueryResolver
} from './sensors.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(sensorExternalResolver),
      schemaHooks.resolveResult(sensorResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(sensorQueryValidator),
      schemaHooks.resolveQuery(sensorQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(sensorDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(sensorDataResolver)],
    patch: [
      schemaHooks.validateData(sensorPatchValidator),
      schemaHooks.resolveData(sensorPatchResolver)
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
