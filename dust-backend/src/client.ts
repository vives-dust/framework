// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { measurementClient } from './services/measurements/measurements.shared'
export type {
  Measurement,
  MeasurementData,
  MeasurementQuery,
  MeasurementPatch
} from './services/measurements/measurements.shared'

import { sensorClient } from './services/sensors/sensors.shared'
export type { Sensor, SensorData, SensorQuery, SensorPatch } from './services/sensors/sensors.shared'

import { deviceClient } from './services/devices/devices.shared'
export type { Device, DeviceData, DeviceQuery, DevicePatch } from './services/devices/devices.shared'

import { treeClient } from './services/trees/trees.shared'
export type { Tree, TreeData, TreeQuery, TreePatch } from './services/trees/trees.shared'

import { conversionModelClient } from './services/conversionmodels/conversionmodels.shared'
export type {
  ConversionModel,
  ConversionModelData,
  ConversionModelQuery,
  ConversionModelPatch
} from './services/conversionmodels/conversionmodels.shared'

import { deviceSensorClient } from './services/devicesensors/devicesensors.shared'
export type {
  DeviceSensor,
  DeviceSensorData,
  DeviceSensorQuery,
  DeviceSensorPatch
} from './services/devicesensors/devicesensors.shared'

import { deviceTypeClient } from './services/devicetypes/devicetypes.shared'
export type {
  DeviceType,
  DeviceTypeData,
  DeviceTypeQuery,
  DeviceTypePatch
} from './services/devicetypes/devicetypes.shared'

import { sensorTypeClient } from './services/sensortypes/sensortypes.shared'
export type {
  SensorType,
  SensorTypeData,
  SensorTypeQuery,
  SensorTypePatch
} from './services/sensortypes/sensortypes.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the dust-backend app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(sensorTypeClient)
  client.configure(deviceTypeClient)
  client.configure(deviceSensorClient)
  client.configure(conversionModelClient)
  client.configure(treeClient)
  client.configure(deviceClient)
  client.configure(sensorClient)
  client.configure(measurementClient)
  return client
}
