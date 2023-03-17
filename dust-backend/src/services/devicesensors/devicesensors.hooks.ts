import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  deviceSensorDataValidator,
  deviceSensorPatchValidator,
  deviceSensorQueryValidator,
  deviceSensorResolver,
  deviceSensorExternalResolver,
  deviceSensorDataResolver,
  deviceSensorPatchResolver,
  deviceSensorQueryResolver
} from './devicesensors.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(deviceSensorExternalResolver),
      schemaHooks.resolveResult(deviceSensorResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(deviceSensorQueryValidator),
      schemaHooks.resolveQuery(deviceSensorQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(deviceSensorDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(deviceSensorDataResolver)
    ],
    patch: [
      schemaHooks.validateData(deviceSensorPatchValidator),
      schemaHooks.resolveData(deviceSensorPatchResolver)
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
