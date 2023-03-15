// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { DeviceSensorsService, getOptions } from './devicesensors.class'
import { deviceSensorsPath, deviceSensorsMethods } from './devicesensors.shared'
import hooks from './devicesensors.hooks'

export * from './devicesensors.class'
export * from './devicesensors.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const deviceSensors = (app: Application) => {
  // Register our service on the Feathers application
  app.use(deviceSensorsPath, new DeviceSensorsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceSensorsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(deviceSensorsPath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [deviceSensorsPath]: DeviceSensorsService
  }
}
