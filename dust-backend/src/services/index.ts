import { measurements } from './measurements/measurements'
import { sensors } from './sensors/sensors'
import { conversionModel } from './conversionmodels/conversionmodels'
import { devices } from './devices/devices'
import { trees } from './trees/trees'
import { deviceSensors } from './devicesensors/devicesensors'
import { deviceTypes } from './devicetypes/devicetypes'
import { user } from './users/users'
import { sensorTypes } from './sensortypes/sensortypes'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(measurements)
  app.configure(sensors)
  app.configure(conversionModel)
  app.configure(devices)
  app.configure(trees)
  app.configure(deviceSensors)
  app.configure(deviceTypes)
  app.configure(user)
  app.configure(sensorTypes)
  // All services will be registered here
}
