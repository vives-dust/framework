// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { MeasurementsService, getOptions } from './measurements.class'
import { measurementsPath, measurementsMethods } from './measurements.shared'
import hooks from './measurements.hooks'

export * from './measurements.class'
export * from './measurements.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const measurements = (app: Application) => {
  // Register our service on the Feathers application
  app.use(measurementsPath, new MeasurementsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: measurementsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(measurementsPath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [measurementsPath]: MeasurementsService
  }
}
