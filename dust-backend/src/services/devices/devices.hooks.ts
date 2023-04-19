import { HookContext } from '@feathersjs/feathers';
import { hooks as schemaHooks } from '@feathersjs/schema'
import { debug, disallow } from 'feathers-hooks-common';

import {
  deviceDataValidator,
  nanoIdDataResolver,
  timestampsDataResolver,
  devicePatchValidator,
  deviceQueryValidator,
  deviceResultResolver,
  deviceExternalResolver,
  deviceTypeGenericResolver,
  treeGenericResolver,
  deviceTypeIdDataResolver,
  deviceQueryResolver,
  deviceBeforeCreateCleanupDataResolver
} from './devices.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(deviceExternalResolver), 
      schemaHooks.resolveResult(
        deviceTypeGenericResolver,    // Need the deviceType for returning the "devicetype" user friendly field
        deviceResultResolver
      ),
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
      schemaHooks.validateData(deviceDataValidator),        // 1. Validate the data coming from the user
      schemaHooks.resolveData(
        nanoIdDataResolver,             // 2. Inject a NanoID as _id
        deviceTypeGenericResolver,      // 3. Populate DeviceType association based on the user provided name
        treeGenericResolver,            // 4. Populate Tree association
        deviceTypeIdDataResolver,       // 5. Set the DeviceType ID based on the populated association
        timestampsDataResolver          // 6. Set timestamps
      ), 
      schemaHooks.resolveData(deviceBeforeCreateCleanupDataResolver), // 7. Cleanup the data before storing it in the database
      // 8. resolveResult providers are run next
      // 9. resolveExternal providers are run next
    ],
    patch: [
      disallow('external'),       // TODO - Fix the patching of external devices
      // schemaHooks.validateData(devicePatchValidator), 
      // schemaHooks.resolveData(devicePatchResolver)
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
