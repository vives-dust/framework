// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import { MetaSchema } from '../../typebox-types/meta'
import { sensorTypeSchema } from '../sensortypes/sensortypes.schema'
import { measurementQueryProperties, measurementSchema } from '../measurements/measurements.schema'
import { dataSourceSchema } from '../../typebox-types/datasource_spec'
import { Query } from '@feathersjs/feathers'
import { conversionModelSchema } from '../conversionmodels/conversionmodels.schema'
import { ValueMapper } from '../conversionmodels/converters/value_mapper'

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
    values: Type.Optional(Type.Array(Type.Ref(measurementSchema))),

    // Associated Data
    _sensortype: Type.Optional(Type.Ref(sensorTypeSchema)),
    _tree: Type.Optional(Type.Any()),        // TODO: Have not been able to Ref treeSchema here
    // Fail: schema implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.ts(7022)
    _conversion_model: Type.Optional(Type.Ref(conversionModelSchema)),

    // type, description and unit of sensor based on associated _sensortype
    type: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    unit: Type.Optional(Type.String()),

    // Associated _tree data
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

// TODO: Refactor to utility / helper
// TODO: Fix query type
// @context.query: Leave empty for just the last value
const fetch_values = (sensor : Sensor, context : HookContext, query: Query) => context.app.service('measurements').find({
  query: {
    bucket: sensor.data_source.bucket,
    measurement: sensor.data_source.measurement,
    tags: sensor.data_source.tags,
    drop: ['codingRate'],   // FIX: For duplicate series
    fields: [ sensor.data_source.field ],
    period: query?.period,
    start: query?.start,
    stop: query?.stop,
    every: query?.every,
    aliases: {
      [sensor.data_source.field]: 'value',
      '_time': 'time',
    },
    pruneTags: true,
  }
});

export const sensorAssociationResolver = resolve<Sensor, HookContext>({
  _sensortype: virtual(async (sensor, context) => {
    // Populate the sensortype associated with this sensor
    return context.app.service('sensortypes').get(sensor.sensortype_id)
  }),
  _tree: virtual(async (sensor, context) => {
    if (!context.params.provider) return undefined;   // Don't populate when internal call!

    // Populate the _tree associated with this sensor
    const device = await context.app.service('devices').get(sensor.device_id);
    return context.app.service('trees').get(device.tree_id);
  }),
  _conversion_model: virtual(async (sensor, context) => {
    return (sensor.meta.conversion_model_id ? await context.app.service('conversionmodels').get(sensor.meta.conversion_model_id) : undefined)
  }),
})

export const sensorLastValueResolver = resolve<Sensor, HookContext>({
  last_value: virtual(async (sensor, context) => {
    const result = await fetch_values(sensor, context, {})

    if (result.length == 0) throw new Error('Last value of measurement not found');    // TODO - Custom error handling
    return result[0];
  }),
})

export const sensorValuesResolver = resolve<Sensor, HookContext>({
  values: virtual(async (sensor, context) => {
    if (!context.params.provider) return undefined;   // Don't populate when internal call

    const result = await fetch_values(sensor, context, context.params.measurementQuery)
    return result;
  }),
})

export const convertSampleValues = resolve<Sensor, HookContext>({
  values: virtual(async (sensor, context) => {
    if (!sensor._conversion_model || !sensor._sensortype || !sensor.values) return sensor.values;
  
    let mapper = new ValueMapper(sensor._conversion_model.samples);
  
    // Convert unit
    if (sensor._sensortype.unit === sensor._conversion_model.input_unit) {
      sensor.unit = sensor._conversion_model.output_unit;
    } else {
      throw new Error('Conversion model input unit does not match sample unit');
    }

    return mapper.convert_values(sensor.values);
  }),
  last_value: virtual(async (sensor, context) => {
    if (!sensor._conversion_model || !sensor._sensortype || !sensor.last_value) return sensor.last_value;
  
    let mapper = new ValueMapper(sensor._conversion_model.samples);
  
    // Convert unit
    if (sensor._sensortype.unit === sensor._conversion_model.input_unit) {
      sensor.unit = sensor._conversion_model.output_unit;
    } else {
      throw new Error('Conversion model input unit does not match sample unit');
    }

    return mapper.convert_value(sensor.last_value);
  }),
})

export const sensorResolver = resolve<Sensor, HookContext>({
  type: virtual(async (sensor, context) => (sensor._sensortype ? sensor._sensortype.type : undefined )),
  description: virtual(async (sensor, context) => (sensor._sensortype ? sensor._sensortype.description  : undefined )),
  unit: virtual(async (sensor, context) => (sensor._sensortype ? sensor._sensortype.unit  : undefined )),
  tree_id: virtual(async (sensor, context) => (sensor._tree ? sensor._tree._id  : undefined )),
  tree_url: virtual(async (sensor, context) => (sensor._tree ? sensor._tree.resource_url  : undefined )),
})

export const sensorExternalResolver = resolve<Sensor, HookContext>({
  _sensortype: async () => undefined,
  device_id: async () => undefined,
  sensortype_id: async () => undefined,
  data_source: async () => undefined,
  _tree: async () => undefined,
  meta: async (meta, sensor, context) => {
    return {
      ...meta,
      ...{
        conversion_model_id: undefined,
        conversion_model_name: sensor._conversion_model?.name
      }
    }
  },
  _conversion_model: async () => undefined,
})


//////////////////////////////////////////////////////////
// CREATING NEW ENTITIES
//////////////////////////////////////////////////////////

// Schema for creating new entries
export const sensorDataSchema = Type.Intersect([
    Type.Partial(Type.Pick(sensorSchema, ['_id'])),                         // Allow _id but don't require it
    Type.Object({
      meta: Type.Pick(MetaSchema, ['depth', 'conversion_model_id'])
    }),
    Type.Pick(sensorSchema, ['sensortype_id', 'name', 'data_source', 'device_id'])
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
export const sensorPatchSchema = Type.Intersect([
    Type.Object({
      meta: Type.Pick(MetaSchema, ['conversion_model_id'])
    }),
    Type.Partial(
      // Need to Pick here because otherwise we can inject createdAt, resource_url, ...
      // No need to disallow _id here, it is ignored; but it makes API more user friendly
      Type.Pick(sensorSchema, ['_id', 'name']),
    )
  ], {
  $id: 'SensorPatch',
  additionalProperties: false
})

export type SensorPatch = Static<typeof sensorPatchSchema>
export const sensorPatchValidator = getValidator(sensorPatchSchema, dataValidator)
export const sensorPatchResolver = resolve<Sensor, HookContext>({
  meta: async (meta, sensor, context) => {
    // Need to fetch the original meta as otherwise we would overwrite the whole meta subdocument.
    // TODO: Probable a better idea to later on move the conversion_model_id to top-level because this is not efficient
    if (!context.id) return undefined
    const originalSensor = (await context.app.service('sensors').get(context.id));
    return { ...originalSensor?.meta, ...meta };
  }
})



//////////////////////////////////////////////////////////
// QUERYING ENTITIES
//////////////////////////////////////////////////////////

// Schema for allowed query properties
export const sensorQueryProperties = Type.Pick(sensorSchema, ['_id', 'device_id'])
export const sensorQuerySchema = Type.Intersect(
  [
    querySyntax(sensorQueryProperties),
    Type.Partial(Type.Pick(measurementQueryProperties, [
      'period', 'start', 'stop', 'every'    // Only these are allowed from via sensors endpoint to select measurements
    ])),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SensorQuery = Static<typeof sensorQuerySchema>
export const sensorQueryValidator = getValidator(sensorQuerySchema, queryValidator)
export const sensorQueryResolver = resolve<SensorQuery, HookContext>({})