// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { SensorTypesService, getOptions } from './sensortypes.class'
import { sensorTypesPath, sensorTypesMethods } from './sensortypes.shared'
import hooks from './sensortypes.hooks'

export * from './sensortypes.class'
export * from './sensortypes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const sensorTypes = (app: Application) => {
  // Register our service on the Feathers application
  app.use(sensorTypesPath, new SensorTypesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: sensorTypesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(sensorTypesPath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [sensorTypesPath]: SensorTypesService
  }
}
