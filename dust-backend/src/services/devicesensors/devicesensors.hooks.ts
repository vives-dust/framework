import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  deviceSensorsDataValidator,
  deviceSensorsPatchValidator,
  deviceSensorsQueryValidator,
  deviceSensorsResolver,
  deviceSensorsExternalResolver,
  deviceSensorsDataResolver,
  deviceSensorsPatchResolver,
  deviceSensorsQueryResolver
} from './devicesensors.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(deviceSensorsExternalResolver),
      schemaHooks.resolveResult(deviceSensorsResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(deviceSensorsQueryValidator),
      schemaHooks.resolveQuery(deviceSensorsQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(deviceSensorsDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(deviceSensorsDataResolver)
    ],
    patch: [
      schemaHooks.validateData(deviceSensorsPatchValidator),
      schemaHooks.resolveData(deviceSensorsPatchResolver)
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
