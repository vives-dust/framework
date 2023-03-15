// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { sensorsClient } from './services/sensors/sensors.shared'
export type { Sensors, SensorsData, SensorsQuery, SensorsPatch } from './services/sensors/sensors.shared'

import { devicesClient } from './services/devices/devices.shared'
export type { Devices, DevicesData, DevicesQuery, DevicesPatch } from './services/devices/devices.shared'

import { treesClient } from './services/trees/trees.shared'
export type { Trees, TreesData, TreesQuery, TreesPatch } from './services/trees/trees.shared'

import { deviceSensorsClient } from './services/devicesensors/devicesensors.shared'
export type {
  DeviceSensors,
  DeviceSensorsData,
  DeviceSensorsQuery,
  DeviceSensorsPatch
} from './services/devicesensors/devicesensors.shared'

import { deviceTypesClient } from './services/devicetypes/devicetypes.shared'
export type {
  DeviceTypes,
  DeviceTypesData,
  DeviceTypesQuery,
  DeviceTypesPatch
} from './services/devicetypes/devicetypes.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

import { sensorTypesClient } from './services/sensortypes/sensortypes.shared'
export type {
  SensorTypes,
  SensorTypesData,
  SensorTypesQuery,
  SensorTypesPatch
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

  client.configure(sensorTypesClient)
  client.configure(userClient)
  client.configure(deviceTypesClient)
  client.configure(deviceSensorsClient)
  client.configure(treesClient)
  client.configure(devicesClient)
  client.configure(sensorsClient)
  return client
}
