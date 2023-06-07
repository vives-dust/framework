// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import { MetaSchema } from '../../typebox-types/meta'
import { sensorTypeSchema } from '../sensortypes/sensortypes.schema'
import { deviceSchema } from '../devices/devices.schema'
import { measurementSchema } from '../measurements/measurements.schema'
import { dataSourceSchema } from '../../typebox-types/datasource_spec'

// Main data model schema
export const sensorSchema = Type.Object(
  {
    // Database fields
    _id: NanoIdSchema,
    name: Type.String(),
    device_id: NanoIdSchema,
    sensortype_id: NanoIdSchema,
    meta: MetaSchema,
    data_source: dataSourceSchema,        // TODO: Ref ?

    // Auto-generated fields (also stored in database)
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),

    // Computed properties
    resource_url: Type.String({ format: 'uri' }),

    // Measurements
    last_value: Type.Ref(measurementSchema),

    // Associated Data
    // _device: Type.Optional(Type.Ref(deviceSchema)),
    _sensortype: Type.Optional(Type.Ref(sensorTypeSchema)),

    // type, description and unit of sensor based on associated _sensortype
    type: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    unit: Type.Optional(Type.String()),

    // tree_id and tree_url are populated based on associated _device
    tree_id: Type.Optional(NanoIdSchema),
    tree_url: Type.Optional(Type.String({ format: 'uri' })),

  },
  { $id: 'Sensor', additionalProperties: false }
)

// A Typescript type for the schema
export type Sensor = Static<typeof sensorSchema>
export const sensorValidator = getValidator(sensorSchema, dataValidator)



//////////////////////////////////////////////////////////
// RESULT RESOLVERS
//////////////////////////////////////////////////////////

export const sensorAssociationResolver = resolve<Sensor, HookContext>({
  _sensortype: virtual(async (sensor, context) => {
    // Populate the sensortype associated with this sensor
    return context.app.service('sensortypes').get(sensor.sensortype_id)
  }),
  // _device: virtual(async (sensor, context) => {
  //   // Populate the _device associated with this sensor
  //   return context.app.service('devices').get(sensor.device_id)
  // }),
  last_value: virtual(async (sensor, context) => {
    // Populate the last value of this sensor
    const result = await context.app.service('measurements').find({
      query: {
        bucket: sensor.data_source.bucket,
        measurement: sensor.data_source.measurement,
        tags: sensor.data_source.tags,
        drop: ['codingRate'],   // FIX: For duplicate series
        fields: [ sensor.data_source.field ],
        period: context.query?.period,
        start: context.query?.start,
        stop: context.query?.stop,
        every: context.query?.every,
        aliases: {
          [sensor.data_source.field]: 'value',
          '_time': 'time',
        },
        pruneTags: true,
      }
    });
    
    if (result.length == 0) throw new Error('Last value of measurement not found');    // TODO - Custom error handling
    return result[0];
  }),

})

export const sensorResolver = resolve<Sensor, HookContext>({
  type: virtual(async (sensor, context) => (sensor._sensortype ? sensor._sensortype.type : undefined )),
  description: virtual(async (sensor, context) => (sensor._sensortype ? sensor._sensortype.description  : undefined )),
  unit: virtual(async (sensor, context) => (sensor._sensortype ? sensor._sensortype.unit  : undefined )),
  // tree_id: virtual(async (sensor, context) => (sensor._device ? sensor._device.tree_id  : undefined )),
  // tree_url: virtual(async (sensor, context) => (sensor._device && sensor._device._tree ? sensor._device._tree.resource_url  : undefined )),
})

export const sensorExternalResolver = resolve<Sensor, HookContext>({
  _sensortype: async () => undefined,
  // device_id: async () => undefined,
  sensortype_id: async () => undefined,
  data_source: async () => undefined,
  // _device: async () => undefined,
})


//////////////////////////////////////////////////////////
// CREATING NEW ENTITIES
//////////////////////////////////////////////////////////

// Schema for creating new entries
export const sensorDataSchema = Type.Intersect([
    Type.Partial(Type.Pick(sensorSchema, ['_id'])),                         // Allow _id but don't require it
    Type.Pick(sensorSchema, ['sensortype_id', 'name', 'meta', 'data_source', 'device_id'])
  ], {
  $id: 'SensorData'
})

export type SensorData = Static<typeof sensorDataSchema>
export const sensorDataValidator = getValidator(sensorDataSchema, dataValidator)
export const sensorDataResolver = resolve<Sensor, HookContext>({})



//////////////////////////////////////////////////////////
// UPDATING EXISTING ENTITIES
//////////////////////////////////////////////////////////

// Schema for updating existing entries
export const sensorPatchSchema = Type.Partial(
  // Need to Pick here because otherwise we can inject createdAt, resource_url, ...
  // No need to disallow _id here, it is ignored; but it makes API more user friendly
  Type.Pick(sensorSchema, ['_id', 'sensortype_id', 'name', 'meta', 'data_source', 'device_id']), {
  $id: 'SensorPatch'
})

export type SensorPatch = Static<typeof sensorPatchSchema>
export const sensorPatchValidator = getValidator(sensorPatchSchema, dataValidator)
export const sensorPatchResolver = resolve<Sensor, HookContext>({})



//////////////////////////////////////////////////////////
// QUERYING ENTITIES
//////////////////////////////////////////////////////////

// Schema for allowed query properties
export const sensorQueryProperties = Type.Pick(sensorSchema, ['_id', 'device_id'])
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
