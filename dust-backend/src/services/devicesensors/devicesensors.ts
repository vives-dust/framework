// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  deviceSensorDataValidator,
  deviceSensorPatchValidator,
  deviceSensorQueryValidator,
  deviceSensorResolver,
  deviceSensorExternalResolver,
  deviceSensorDataResolver,
  deviceSensorPatchResolver,
  deviceSensorQueryResolver,
  deviceSensorAssociatedTypesResolver
} from './devicesensors.schema'

import type { Application } from '../../declarations'
import { DeviceSensorService, getOptions } from './devicesensors.class'
import { deviceSensorPath, deviceSensorMethods } from './devicesensors.shared'
import { nanoIdDataResolver, timestampsDataResolver } from '../../resolvers/data.resolvers'
import { removeTimeStampsExternalResolver } from '../../resolvers/external.resolvers'

export * from './devicesensors.class'
export * from './devicesensors.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const deviceSensor = (app: Application) => {
  // Register our service on the Feathers application
  app.use(deviceSensorPath, new DeviceSensorService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceSensorMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(deviceSensorPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(
          deviceSensorExternalResolver,
          removeTimeStampsExternalResolver
        ),
        schemaHooks.resolveResult(deviceSensorResolver)
      ],
      get: [
        schemaHooks.resolveResult(deviceSensorAssociatedTypesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(deviceSensorQueryValidator),
        schemaHooks.resolveQuery(deviceSensorQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(deviceSensorDataValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          nanoIdDataResolver,
          timestampsDataResolver,
        ),
        schemaHooks.resolveData(deviceSensorDataResolver)
      ],
      patch: [
        schemaHooks.validateData(deviceSensorPatchValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          timestampsDataResolver,
        ),
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
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [deviceSensorPath]: DeviceSensorService
  }
}
