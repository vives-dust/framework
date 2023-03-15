// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { devicesSchema } from '../devices/devices.schema'
import { sensorTypesSchema } from '../sensortypes/sensortypes.schema'
import { MetaSchema } from '../../typebox-types/meta'
import { DataSourceSchema } from '../../typebox-types/datasource_spec'

// Main data model schema
export const sensorsSchema = Type.Object(
  {
    _id: NanoIdSchema,
    name: Type.String(),
    device_id: NanoIdSchema,
    sensortype_id: NanoIdSchema,
    meta: MetaSchema,
    data_source: DataSourceSchema,
    // Auto-generated fields
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    // Auto-generated virtual fields
    sensor_url: Type.String({ format: 'uri' }),
    // Associated Data
    device: Type.Ref(devicesSchema),
    sensortype: Type.Ref(sensorTypesSchema),
  },
  { $id: 'Sensors', additionalProperties: false }
)
export type Sensors = Static<typeof sensorsSchema>
export const sensorsValidator = getValidator(sensorsSchema, dataValidator)
export const sensorsResolver = resolve<Sensors, HookContext>({
  device: virtual(async (sensor, context) => {
    // Populate the device associated with this sensor
    return context.app.service('devices').get(sensor.device_id)
  }),
  sensortype: virtual(async (sensor, context) => {
    // Populate the sensortype associated with this sensor
    return context.app.service('sensortypes').get(sensor.sensortype_id)
  }),
  sensor_url: virtual(async (sensor, context) => {
    return `${context.app.get('application').domain}/${context.path}/${sensor._id}`
  })
})

export const sensorsExternalResolver = resolve<Sensors, HookContext>({})

// Schema for creating new entries
export const sensorsDataSchema = Type.Pick(sensorsSchema, ['sensortype_id', 'name', 'meta', 'data_source', 'device_id'], {
  $id: 'SensorsData'
})
export type SensorsData = Static<typeof sensorsDataSchema>
export const sensorsDataValidator = getValidator(sensorsDataSchema, dataValidator)
export const sensorsDataResolver = resolve<Sensors, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const sensorsPatchSchema = Type.Partial(Type.Omit(sensorsSchema, ['createdAt', 'updatedAt']), {
  $id: 'SensorsPatch'
})
export type SensorsPatch = Static<typeof sensorsPatchSchema>
export const sensorsPatchValidator = getValidator(sensorsPatchSchema, dataValidator)
export const sensorsPatchResolver = resolve<Sensors, HookContext>({})

// Schema for allowed query properties
export const sensorsQueryProperties = Type.Pick(sensorsSchema, ['_id'])
export const sensorsQuerySchema = Type.Intersect(
  [
    querySyntax(sensorsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SensorsQuery = Static<typeof sensorsQuerySchema>
export const sensorsQueryValidator = getValidator(sensorsQuerySchema, queryValidator)
export const sensorsQueryResolver = resolve<SensorsQuery, HookContext>({})
