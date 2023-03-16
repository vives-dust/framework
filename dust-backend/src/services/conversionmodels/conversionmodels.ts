// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { ConversionModelsService, getOptions } from './conversionmodels.class'
import { conversionModelsPath, conversionModelsMethods } from './conversionmodels.shared'
import hooks from './conversionmodels.hooks'

export * from './conversionmodels.class'
export * from './conversionmodels.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const conversionModels = (app: Application) => {
  // Register our service on the Feathers application
  app.use(conversionModelsPath, new ConversionModelsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: conversionModelsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(conversionModelsPath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [conversionModelsPath]: ConversionModelsService
  }
}
