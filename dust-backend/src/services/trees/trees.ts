// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  treeDataValidator,
  treePatchValidator,
  treeQueryValidator,
  treeResolver,
  treeExternalResolver,
  treeDataResolver,
  treePatchResolver,
  treeQueryResolver,
  treeDevicesResolver,
  treeSensorsResolver
} from './trees.schema'

import type { Application } from '../../declarations'
import { TreeService, getOptions } from './trees.class'
import { treePath, treeMethods } from './trees.shared'
import { nanoIdDataResolver, timestampsDataResolver } from '../../resolvers/data.resolvers'
import { removeTimeStampsExternalResolver } from '../../resolvers/external.resolvers'
import { setResourceUrlExternalResolver } from '../../resolvers/result.resolvers'

export * from './trees.class'
export * from './trees.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const tree = (app: Application) => {
  // Register our service on the Feathers application
  app.use(treePath, new TreeService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: treeMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(treePath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(
          treeExternalResolver,
          removeTimeStampsExternalResolver
        ),
        schemaHooks.resolveResult(
          treeResolver,
          setResourceUrlExternalResolver,
        )
      ],
      get: [
        // Here we provide listing of devices and sensors belonging to the tree
        schemaHooks.resolveResult(
          treeDevicesResolver,
          treeSensorsResolver,
        )
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(treeQueryValidator),
        schemaHooks.resolveQuery(treeQueryResolver),
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(treeDataValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          nanoIdDataResolver,
          timestampsDataResolver,
        ),
        schemaHooks.resolveData(treeDataResolver)
      ],
      patch: [
        schemaHooks.validateData(treePatchValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          timestampsDataResolver,
        ),
        schemaHooks.resolveData(treePatchResolver)
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
    [treePath]: TreeService
  }
}
