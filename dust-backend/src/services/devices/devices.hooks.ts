import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  devicesDataValidator,
  devicesPatchValidator,
  devicesQueryValidator,
  devicesResolver,
  devicesExternalResolver,
  devicesDataResolver,
  devicesPatchResolver,
  devicesQueryResolver
} from './devices.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(devicesExternalResolver), 
      schemaHooks.resolveResult(devicesResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(devicesQueryValidator), 
      schemaHooks.resolveQuery(devicesQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(devicesDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(devicesDataResolver)
    ],
    patch: [
      schemaHooks.validateData(devicesPatchValidator), 
      schemaHooks.resolveData(devicesPatchResolver)
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
