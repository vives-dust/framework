import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  deviceDataValidator,
  devicePatchValidator,
  deviceQueryValidator,
  deviceResolver,
  deviceExternalResolver,
  deviceDataResolver,
  devicePatchResolver,
  deviceQueryResolver
} from './devices.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(deviceExternalResolver), 
      schemaHooks.resolveResult(deviceResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(deviceQueryValidator), 
      schemaHooks.resolveQuery(deviceQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(deviceDataValidator), 
      inject_nano_id,
      schemaHooks.resolveData(deviceDataResolver)
    ],
    patch: [
      schemaHooks.validateData(devicePatchValidator), 
      schemaHooks.resolveData(devicePatchResolver)
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
