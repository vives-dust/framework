// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { DeviceSensorService, getOptions } from './devicesensors.class'
import { deviceSensorPath, deviceSensorMethods } from './devicesensors.shared'
import hooks from './devicesensors.hooks'

export * from './devicesensors.class'
export * from './devicesensors.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const deviceSensor = (app: Application) => {
  // Register our service on the Feathers application
  app.use(deviceSensorPath, new DeviceSensorService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceSensorMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(deviceSensorPath).hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [deviceSensorPath]: DeviceSensorService
  }
}
