// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  sensorDataValidator,
  sensorPatchValidator,
  sensorQueryValidator,
  sensorResolver,
  sensorExternalResolver,
  sensorDataResolver,
  sensorPatchResolver,
  sensorQueryResolver,
  sensorTypeGenericResolver
} from './sensors.schema'

import type { Application } from '../../declarations'
import { SensorService, getOptions } from './sensors.class'
import { sensorPath, sensorMethods } from './sensors.shared'
import { nanoIdDataResolver, timestampsDataResolver } from '../../resolvers/data.resolvers'
import { removeTimeStampsExternalResolver } from '../../resolvers/external.resolvers'
import { setResourceUrlExternalResolver } from '../../resolvers/result.resolvers'

export * from './sensors.class'
export * from './sensors.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const sensor = (app: Application) => {
  // Register our service on the Feathers application
  app.use(sensorPath, new SensorService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: sensorMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(sensorPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(
          sensorExternalResolver,
          removeTimeStampsExternalResolver,
        ),
        schemaHooks.resolveResult(
          sensorTypeGenericResolver,        // Need to populate the _sensortype first
          sensorResolver,
          setResourceUrlExternalResolver,
        )
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(sensorQueryValidator),
        schemaHooks.resolveQuery(sensorQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(sensorDataValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          nanoIdDataResolver,
          timestampsDataResolver,
        ),
        schemaHooks.resolveData(sensorDataResolver)
      ],
      patch: [
        schemaHooks.validateData(sensorPatchValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          timestampsDataResolver,
        ),
        schemaHooks.resolveData(sensorPatchResolver)
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
    [sensorPath]: SensorService
  }
}
