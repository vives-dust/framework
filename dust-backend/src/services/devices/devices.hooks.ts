import { HookContext } from '@feathersjs/feathers';
import { hooks as schemaHooks } from '@feathersjs/schema'
import { debug } from 'feathers-hooks-common';
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  deviceDataValidator,
  devicePatchValidator,
  deviceQueryValidator,
  deviceResolver,
  deviceExternalResolver,
  deviceTypeResolver,
  deviceTreeResolver,
  deviceDataResolver,
  devicePatchResolver,
  deviceQueryResolver,
  deviceTypeResultResolver
} from './devices.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(deviceExternalResolver), 
      schemaHooks.resolveResult(deviceTypeResultResolver, deviceResolver)
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
      // Resolvers are run in sequence
      schemaHooks.resolveData(deviceTypeResolver, deviceTreeResolver, deviceDataResolver),
      // debug('Is the device resolved run here ?'),
    ],
    patch: [
      schemaHooks.validateData(devicePatchValidator), 
      schemaHooks.resolveData(devicePatchResolver)
    ],
    remove: []
  },
  after: {
    all: [],
    create: [
      // TODO - Here we need to create the sensors for the device
    ]
  },
  error: {
    all: []
  }
};
