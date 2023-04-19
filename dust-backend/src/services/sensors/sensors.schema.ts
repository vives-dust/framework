// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { deviceSchema } from '../devices/devices.schema'
import { sensorTypeSchema } from '../sensortypes/sensortypes.schema'
import { MetaSchema } from '../../typebox-types/meta'
import { DataSourceSchema } from '../../typebox-types/datasource_spec'

// Main data model schema
export const sensorSchema = Type.Object(
  {
    // Database fields
    _id: NanoIdSchema,
    name: Type.String(),
    device_id: NanoIdSchema,
    sensortype_id: NanoIdSchema,
    meta: MetaSchema,
    data_source: DataSourceSchema,

    // Auto-generated fields (also stored in database)
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),

    // Associated Data
    _device: Type.Ref(deviceSchema),
    _sensortype: Type.Ref(sensorTypeSchema),

    // Computed properties
    sensor_url: Type.String({ format: 'uri' }),
  },
  { $id: 'Sensor', additionalProperties: false }
)
export type Sensor = Static<typeof sensorSchema>
export const sensorValidator = getValidator(sensorSchema, dataValidator)
export const sensorResolver = resolve<Sensor, HookContext>({
  _device: virtual(async (sensor, context) => {
    // Populate the device associated with this sensor
    return context.app.service('devices').get(sensor.device_id)
  }),
  _sensortype: virtual(async (sensor, context) => {
    // Populate the sensortype associated with this sensor
    return context.app.service('sensortypes').get(sensor.sensortype_id)
  }),
  sensor_url: virtual(async (sensor, context) => {
    return `${context.app.get('application').domain}/${context.path}/${sensor._id}`
  })
})

export const sensorExternalResolver = resolve<Sensor, HookContext>({})

// Schema for creating new entries
export const sensorDataSchema = Type.Pick(sensorSchema, ['sensortype_id', 'name', 'meta', 'data_source', 'device_id'], {
  $id: 'SensorData'
})
export type SensorData = Static<typeof sensorDataSchema>
export const sensorDataValidator = getValidator(sensorDataSchema, dataValidator)
export const sensorDataResolver = resolve<Sensor, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const sensorPatchSchema = Type.Partial(Type.Omit(sensorSchema, ['createdAt', 'updatedAt']), {
  $id: 'sensorPatch'
})
export type SensorPatch = Static<typeof sensorPatchSchema>
export const sensorPatchValidator = getValidator(sensorPatchSchema, dataValidator)
export const sensorPatchResolver = resolve<Sensor, HookContext>({})

// Schema for allowed query properties
export const sensorQueryProperties = Type.Pick(sensorSchema, ['_id'])
export const sensorQuerySchema = Type.Intersect(
  [
    querySyntax(sensorQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SensorQuery = Static<typeof sensorQuerySchema>
export const sensorQueryValidator = getValidator(sensorQuerySchema, queryValidator)
export const sensorQueryResolver = resolve<SensorQuery, HookContext>({})
