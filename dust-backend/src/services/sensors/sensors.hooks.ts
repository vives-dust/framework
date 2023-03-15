import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  sensorsDataValidator,
  sensorsPatchValidator,
  sensorsQueryValidator,
  sensorsResolver,
  sensorsExternalResolver,
  sensorsDataResolver,
  sensorsPatchResolver,
  sensorsQueryResolver
} from './sensors.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(sensorsExternalResolver),
      schemaHooks.resolveResult(sensorsResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(sensorsQueryValidator),
      schemaHooks.resolveQuery(sensorsQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(sensorsDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(sensorsDataResolver)],
    patch: [
      schemaHooks.validateData(sensorsPatchValidator),
      schemaHooks.resolveData(sensorsPatchResolver)
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
