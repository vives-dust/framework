// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  conversionModelDataValidator,
  conversionModelPatchValidator,
  conversionModelQueryValidator,
  conversionModelResolver,
  conversionModelExternalResolver,
  conversionModelDataResolver,
  conversionModelPatchResolver,
  conversionModelQueryResolver
} from './conversionmodels.schema'

import type { Application } from '../../declarations'
import { ConversionModelService, getOptions } from './conversionmodels.class'
import { conversionModelPath, conversionModelMethods } from './conversionmodels.shared'
import { nanoIdDataResolver, timestampsDataResolver } from '../../resolvers/data.resolvers'
import { removeTimeStampsExternalResolver } from '../../resolvers/external.resolvers'

export * from './conversionmodels.class'
export * from './conversionmodels.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const conversionModel = (app: Application) => {
  // Register our service on the Feathers application
  app.use(conversionModelPath, new ConversionModelService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: conversionModelMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(conversionModelPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(
          conversionModelExternalResolver,
          removeTimeStampsExternalResolver
        ),
        schemaHooks.resolveResult(conversionModelResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(conversionModelQueryValidator),
        schemaHooks.resolveQuery(conversionModelQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(conversionModelDataValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          nanoIdDataResolver,
          timestampsDataResolver,
        ),
        schemaHooks.resolveData(conversionModelDataResolver)
      ],
      patch: [
        schemaHooks.validateData(conversionModelPatchValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          timestampsDataResolver,
        ),
        schemaHooks.resolveData(conversionModelPatchResolver)
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
    [conversionModelPath]: ConversionModelService
  }
}
