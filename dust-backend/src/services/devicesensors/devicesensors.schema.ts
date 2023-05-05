// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import { DataSourceSpecSchema } from '../../typebox-types/datasource_spec'
import { MetaSchema } from '../../typebox-types/meta'
import { deviceTypeSchema } from '../devicetypes/devicetypes.schema'
import { sensorTypeSchema } from '../sensortypes/sensortypes.schema'

// Main data model schema
export const deviceSensorSchema = Type.Object(
  {
    // Database fields
    _id: NanoIdSchema,
    devicetype_id: NanoIdSchema,
    sensortype_id: NanoIdSchema,
    data_source: DataSourceSpecSchema,
    meta: MetaSchema,

    // Auto-generated fields (also stored in database)
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),

    // Associated Data
    _devicetype: Type.Ref(deviceTypeSchema),
    _sensortype: Type.Ref(sensorTypeSchema),

  },
  { $id: 'DeviceSensor', additionalProperties: false }
)

// A Typescript type for the schema
export type DeviceSensor = Static<typeof deviceSensorSchema>
export const deviceSensorValidator = getValidator(deviceSensorSchema, dataValidator)



//////////////////////////////////////////////////////////
// RESULT RESOLVERS
//////////////////////////////////////////////////////////


export const deviceSensorAssociationResolver = resolve<DeviceSensor, HookContext>({
  // Populate the _devicetype and _sensortype fields associated with this devicesensor
  _devicetype: virtual(async (devicesensor, context) => {
    return context.app.service('devicetypes').get(devicesensor.devicetype_id)
  }),
  _sensortype: virtual(async (devicesensor, context) => {
    return context.app.service('sensortypes').get(devicesensor.sensortype_id)
  }),
})

export const deviceSensorResolver = resolve<DeviceSensor, HookContext>({
})

export const deviceSensorExternalResolver = resolve<DeviceSensor, HookContext>({
  _devicetype: async () => undefined,
  _sensortype: async () => undefined,
})



//////////////////////////////////////////////////////////
// CREATING NEW ENTITIES
//////////////////////////////////////////////////////////

// Schema for creating new entries
export const deviceSensorDataSchema = Type.Intersect([
    Type.Partial(Type.Pick(deviceSensorSchema, ['_id'])),                         // Allow _id but don't require it
    Type.Pick(deviceSensorSchema, [
      'devicetype_id', 'sensortype_id', 'data_source', 'meta'
    ])
  ], {
  $id: 'DeviceSensorData'
})

export type DeviceSensorData = Static<typeof deviceSensorDataSchema>
export const deviceSensorDataValidator = getValidator(deviceSensorDataSchema, dataValidator)
export const deviceSensorDataResolver = resolve<DeviceSensor, HookContext>({})



//////////////////////////////////////////////////////////
// UPDATING EXISTING ENTITIES
//////////////////////////////////////////////////////////

// Schema for updating existing entries
export const deviceSensorPatchSchema = Type.Partial(
  // Need to Pick here because otherwise we can inject createdAt, resource_url, ...
  // No need to disallow _id here, it is ignored; but it makes API more user friendly
  Type.Pick(deviceSensorSchema, ['_id', 'devicetype_id', 'sensortype_id', 'data_source', 'meta']), {
  $id: 'DeviceSensorPatch'
})

export type DeviceSensorPatch = Static<typeof deviceSensorPatchSchema>
export const deviceSensorPatchValidator = getValidator(deviceSensorPatchSchema, dataValidator)
export const deviceSensorPatchResolver = resolve<DeviceSensor, HookContext>({})



//////////////////////////////////////////////////////////
// QUERYING ENTITIES
//////////////////////////////////////////////////////////

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
