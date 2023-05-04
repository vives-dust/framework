// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

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

import type { Application } from '../../declarations'
import { DeviceTypeService, getOptions } from './devicetypes.class'
import { deviceTypePath, deviceTypeMethods } from './devicetypes.shared'
import { nanoIdDataResolver, timestampsDataResolver } from '../../resolvers/data.resolvers'
import { removeTimeStampsExternalResolver } from '../../resolvers/external.resolvers'

export * from './devicetypes.class'
export * from './devicetypes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const deviceType = (app: Application) => {
  // Register our service on the Feathers application
  app.use(deviceTypePath, new DeviceTypeService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceTypeMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(deviceTypePath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(
          deviceTypeExternalResolver,
          removeTimeStampsExternalResolver
        ),
        schemaHooks.resolveResult(deviceTypeResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(deviceTypeQueryValidator),
        schemaHooks.resolveQuery(deviceTypeQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(deviceTypeDataValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          nanoIdDataResolver,
          timestampsDataResolver,
        ),
        schemaHooks.resolveData(deviceTypeDataResolver)
      ],
      patch: [
        schemaHooks.validateData(deviceTypePatchValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          timestampsDataResolver,
        ),
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
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [deviceTypePath]: DeviceTypeService
  }
}
