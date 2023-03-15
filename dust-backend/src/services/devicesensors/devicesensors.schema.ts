// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { deviceTypesSchema } from '../devicetypes/devicetypes.schema'
import { sensorTypesSchema } from '../sensortypes/sensortypes.schema'
import { MetaSchema } from '../../typebox-types/meta'
import { DataSourceSpecSchema } from '../../typebox-types/datasource_spec'

// Main data model schema
export const deviceSensorsSchema = Type.Object(
  {
    _id: NanoIdSchema,
    devicetype_id: NanoIdSchema,
    sensortype_id: NanoIdSchema,
    data_source: DataSourceSpecSchema,
    meta: MetaSchema,
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    devicetype: Type.Ref(deviceTypesSchema),
    sensortype: Type.Ref(sensorTypesSchema),
  },
  { $id: 'DeviceSensors', additionalProperties: false }
)
export type DeviceSensors = Static<typeof deviceSensorsSchema>
export const deviceSensorsValidator = getValidator(deviceSensorsSchema, dataValidator)
export const deviceSensorsResolver = resolve<DeviceSensors, HookContext>({
  devicetype: virtual(async (devicesensor, context) => {
    // Populate the devicetype associated with this devicesensor
    return context.app.service('devicetypes').get(devicesensor.devicetype_id)
  }),
  sensortype: virtual(async (devicesensor, context) => {
    // Populate the sensortype associated with this devicesensor
    return context.app.service('sensortypes').get(devicesensor.sensortype_id)
  })
})

export const deviceSensorsExternalResolver = resolve<DeviceSensors, HookContext>({})

// Schema for creating new entries
export const deviceSensorsDataSchema = Type.Pick(deviceSensorsSchema, [
    'devicetype_id', 'sensortype_id', 'data_source', 'meta'
  ], {
  $id: 'DeviceSensorsData'
})
export type DeviceSensorsData = Static<typeof deviceSensorsDataSchema>
export const deviceSensorsDataValidator = getValidator(deviceSensorsDataSchema, dataValidator)
export const deviceSensorsDataResolver = resolve<DeviceSensors, HookContext>({})

// Schema for updating existing entries
export const deviceSensorsPatchSchema = Type.Partial(Type.Omit(deviceSensorsSchema, ['createdAt', 'updatedAt']), {
  $id: 'DeviceSensorsPatch'
})
export type DeviceSensorsPatch = Static<typeof deviceSensorsPatchSchema>
export const deviceSensorsPatchValidator = getValidator(deviceSensorsPatchSchema, dataValidator)
export const deviceSensorsPatchResolver = resolve<DeviceSensors, HookContext>({})

// Schema for allowed query properties
export const deviceSensorsQueryProperties = Type.Pick(deviceSensorsSchema, ['_id', 'devicetype_id'])
export const deviceSensorsQuerySchema = Type.Intersect(
  [
    querySyntax(deviceSensorsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DeviceSensorsQuery = Static<typeof deviceSensorsQuerySchema>
export const deviceSensorsQueryValidator = getValidator(deviceSensorsQuerySchema, queryValidator)
export const deviceSensorsQueryResolver = resolve<DeviceSensorsQuery, HookContext>({})
