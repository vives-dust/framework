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
  sensorAssociationResolver,
  sensorValuesResolver,
  sensorLastValueResolver,
  convertSampleValues,
} from './sensors.schema'

import type { Application, HookContext } from '../../declarations'
import { SensorService, getOptions } from './sensors.class'
import { sensorPath, sensorMethods } from './sensors.shared'
import { nanoIdDataResolver, timestampsDataResolver } from '../../resolvers/data.resolvers'
import { removeTimeStampsExternalResolver } from '../../resolvers/external.resolvers'
import { setResourceUrlExternalResolver } from '../../resolvers/result.resolvers'
import { disallow } from 'feathers-hooks-common'

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
          sensorAssociationResolver,        // Resolve _sensortype and _device associations first
          sensorResolver,
          setResourceUrlExternalResolver,
          sensorLastValueResolver,
          convertSampleValues,
        )
      ],
      get: [
        schemaHooks.resolveResult(
          sensorValuesResolver
        ),
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(sensorQueryValidator),
        schemaHooks.resolveQuery(sensorQueryResolver)
      ],
      find: [ disallow('external') ],
      get: [
        extract_measurement_query_to_context,
      ],
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

// Bit of a back but we need to remove the query properties that are
// needed for the measurements from params.query because these are used
// for the sensor selection itself.
const extract_measurement_query_to_context = (context: HookContext) => {
  if (context.params.query) {
    const { query: {
        period, start, stop, every,
        ...query
      }
    } = context.params;
    
    context.params = {
      ...context.params,
      query,
      measurementQuery: {
        period, start, stop, every
      }
    }

    return context;
  }
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [sensorPath]: SensorService
  }
}
