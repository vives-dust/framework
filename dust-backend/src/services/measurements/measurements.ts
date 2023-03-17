// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { MeasurementService, getOptions } from './measurements.class'
import { measurementPath, measurementMethods } from './measurements.shared'
import hooks from './measurements.hooks'

export * from './measurements.class'
export * from './measurements.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const measurement = (app: Application) => {
  // Register our service on the Feathers application
  app.use(measurementPath, new MeasurementService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: measurementMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(measurementPath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [measurementPath]: MeasurementService
  }
}
