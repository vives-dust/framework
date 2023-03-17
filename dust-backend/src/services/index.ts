import { sensorType } from './sensortypes/sensortypes'
import { sensor } from './sensors/sensors'
import { measurement } from './measurements/measurements'
import { deviceType } from './devicetypes/devicetypes'
import { deviceSensor } from './devicesensors/devicesensors'
import { device } from './devices/devices'
import { conversionModel } from './conversionmodels/conversionmodels'
import { tree } from './trees/trees'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(sensorType)
  app.configure(sensor)
  app.configure(measurement)
  app.configure(deviceType)
  app.configure(deviceSensor)
  app.configure(device)
  app.configure(conversionModel)
  app.configure(tree)
  app.configure(user)
  // All services will be registered here
}
