// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { deviceTypeSchema } from '../devicetypes/devicetypes.schema'
import { sensorTypeSchema } from '../sensortypes/sensortypes.schema'
import { MetaSchema } from '../../typebox-types/meta'
import { DataSourceSpecSchema } from '../../typebox-types/datasource_spec'

// Main data model schema
export const deviceSensorSchema = Type.Object(
  {
    _id: NanoIdSchema,
    devicetype_id: NanoIdSchema,
    sensortype_id: NanoIdSchema,
    data_source: DataSourceSpecSchema,
    meta: MetaSchema,

    // Auto-generated fields
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),

    // Associated Data
    _devicetype: Type.Ref(deviceTypeSchema),
    _sensortype: Type.Ref(sensorTypeSchema),
  },
  { $id: 'DeviceSensor', additionalProperties: false }
)
export type DeviceSensor = Static<typeof deviceSensorSchema>
export const deviceSensorValidator = getValidator(deviceSensorSchema, dataValidator)
export const deviceSensorResolver = resolve<DeviceSensor, HookContext>({
  _devicetype: virtual(async (devicesensor, context) => {
    // Populate the devicetype associated with this devicesensor
    return context.app.service('devicetypes').get(devicesensor.devicetype_id)
  }),
  _sensortype: virtual(async (devicesensor, context) => {
    // Populate the sensortype associated with this devicesensor
    return context.app.service('sensortypes').get(devicesensor.sensortype_id)
  }),
})

export const deviceSensorExternalResolver = resolve<DeviceSensor, HookContext>({})

// Schema for creating new entries
export const deviceSensorDataSchema = Type.Pick(deviceSensorSchema, [
  'devicetype_id', 'sensortype_id', 'data_source', 'meta'
], {
  $id: 'DeviceSensorData'
})
export type DeviceSensorData = Static<typeof deviceSensorDataSchema>
export const deviceSensorDataValidator = getValidator(deviceSensorDataSchema, dataValidator)
export const deviceSensorDataResolver = resolve<DeviceSensor, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const deviceSensorPatchSchema = Type.Partial(Type.Omit(deviceSensorSchema, ['createdAt', 'updatedAt']), {
  $id: 'DeviceSensorPatch'
})
export type DeviceSensorPatch = Static<typeof deviceSensorPatchSchema>
export const deviceSensorPatchValidator = getValidator(deviceSensorPatchSchema, dataValidator)
export const deviceSensorPatchResolver = resolve<DeviceSensor, HookContext>({
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for allowed query properties
export const deviceSensorQueryProperties = Type.Pick(deviceSensorSchema, ['_id', 'devicetype_id'])
export const deviceSensorQuerySchema = Type.Intersect(
  [
    querySyntax(deviceSensorQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DeviceSensorQuery = Static<typeof deviceSensorQuerySchema>
export const deviceSensorQueryValidator = getValidator(deviceSensorQuerySchema, queryValidator)
export const deviceSensorQueryResolver = resolve<DeviceSensorQuery, HookContext>({})
