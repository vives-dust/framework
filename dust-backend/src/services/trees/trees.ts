// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { TreesService, getOptions } from './trees.class'
import hooks from './trees.hooks'
import { treesPath, treesMethods } from './trees.shared'

export * from './trees.class'
export * from './trees.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const trees = (app: Application) => {
  // Register our service on the Feathers application
  app.use(treesPath, new TreesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: treesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(treesPath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [treesPath]: TreesService
  }
}
