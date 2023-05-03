// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  sensorTypeDataValidator,
  sensorTypePatchValidator,
  sensorTypeQueryValidator,
  sensorTypeResolver,
  sensorTypeExternalResolver,
  sensorTypeDataResolver,
  sensorTypePatchResolver,
  sensorTypeQueryResolver
} from './sensortypes.schema'

import type { Application } from '../../declarations'
import { SensorTypeService, getOptions } from './sensortypes.class'
import { sensorTypePath, sensorTypeMethods } from './sensortypes.shared'
import { nanoIdDataResolver, timestampsDataResolver } from '../../resolvers/data.resolvers'
import { removeTimeStampsExternalResolver } from '../../resolvers/external.resolvers'

export * from './sensortypes.class'
export * from './sensortypes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const sensorType = (app: Application) => {
  // Register our service on the Feathers application
  app.use(sensorTypePath, new SensorTypeService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: sensorTypeMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(sensorTypePath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(sensorTypeExternalResolver, removeTimeStampsExternalResolver),
        schemaHooks.resolveResult(sensorTypeResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(sensorTypeQueryValidator),
        schemaHooks.resolveQuery(sensorTypeQueryResolver),
        schemaHooks.resolveData(    // Will only run for all methods that have DATA
          nanoIdDataResolver,
          timestampsDataResolver,
        ),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(sensorTypeDataValidator),
        schemaHooks.resolveData(sensorTypeDataResolver)
      ],
      patch: [
        schemaHooks.validateData(sensorTypePatchValidator),
        schemaHooks.resolveData(sensorTypePatchResolver)
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
    [sensorTypePath]: SensorTypeService
  }
}
