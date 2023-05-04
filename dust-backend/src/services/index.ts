import { device } from './devices/devices'
import { tree } from './trees/trees'
import { conversionModel } from './conversionmodels/conversionmodels'
import { deviceSensor } from './devicesensors/devicesensors'
import { deviceType } from './devicetypes/devicetypes'
import { sensorType } from './sensortypes/sensortypes'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(device)
  app.configure(tree)
  app.configure(conversionModel)
  app.configure(deviceSensor)
  app.configure(deviceType)
  app.configure(sensorType)
  // All services will be registered here
}
