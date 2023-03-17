// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { SensorTypeService, getOptions } from './sensortypes.class'
import { sensorTypePath, sensorTypeMethods } from './sensortypes.shared'
import hooks from './sensortypes.hooks'

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
  app.service(sensorTypePath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [sensorTypePath]: SensorTypeService
  }
}
