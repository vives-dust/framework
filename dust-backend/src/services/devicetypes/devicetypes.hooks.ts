import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  deviceTypeDataValidator,
  deviceTypePatchValidator,
  deviceTypeQueryValidator,
  deviceTypeResolver,
  deviceTypeExternalResolver,
  deviceTypeDataResolver,
  deviceTypePatchResolver,
  deviceTypeQueryResolver
} from './devicetypes.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(deviceTypeExternalResolver),
      schemaHooks.resolveResult(deviceTypeResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(deviceTypeQueryValidator),
      schemaHooks.resolveQuery(deviceTypeQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(deviceTypeDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(deviceTypeDataResolver)
    ],
    patch: [
      schemaHooks.validateData(deviceTypePatchValidator),
      schemaHooks.resolveData(deviceTypePatchResolver)
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
