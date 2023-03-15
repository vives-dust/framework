// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { SensorsService, getOptions } from './sensors.class'
import { sensorsPath, sensorsMethods } from './sensors.shared'
import hooks from './sensors.hooks'

export * from './sensors.class'
export * from './sensors.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const sensors = (app: Application) => {
  // Register our service on the Feathers application
  app.use(sensorsPath, new SensorsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: sensorsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(sensorsPath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [sensorsPath]: SensorsService
  }
}
