import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  deviceTypesDataValidator,
  deviceTypesPatchValidator,
  deviceTypesQueryValidator,
  deviceTypesResolver,
  deviceTypesExternalResolver,
  deviceTypesDataResolver,
  deviceTypesPatchResolver,
  deviceTypesQueryResolver
} from './devicetypes.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(deviceTypesExternalResolver),
      schemaHooks.resolveResult(deviceTypesResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(deviceTypesQueryValidator),
      schemaHooks.resolveQuery(deviceTypesQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(deviceTypesDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(deviceTypesDataResolver)
    ],
    patch: [
      schemaHooks.validateData(deviceTypesPatchValidator),
      schemaHooks.resolveData(deviceTypesPatchResolver)
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
