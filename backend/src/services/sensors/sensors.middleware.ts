import { default as feathers, HookContext } from '@feathersjs/feathers';
import { ValueMapper } from '../conversionmodels/converters/value_mapper';

// Resolvers are used by fastJoin to populate child object relations
export const sensor_resolvers = {
  joins: {
    device: () => async (sensor : any, context: HookContext) => sensor.device = (await context.app.service('devices').get(sensor.device_id)),
    device_and_tree: {
      resolver: () => async (sensor : any, context: HookContext) => sensor.device = (await context.app.service('devices').get(sensor.device_id)),
      joins: {
        joins: {
          tree: () => async (device : any, context: HookContext) => device.tree = (await context.app.service('trees').get(device.tree_id)),
        }
      }
    },
    sensor_type: () => async (sensor : any, context: HookContext) => sensor.sensor_type = (await context.app.service('sensortypes').get(sensor.sensortype_id)),
    conversion_model: () => async (sensor : any, context: HookContext) => sensor.conversion_model = (await context.app.service('conversionmodels').get(sensor.meta.conversion_model_id)),
  }
};

// TODO: Refactor to utility / helper
// TODO: Type for query
// @query: Leave empty for just the last value
const fetch_values = (context : HookContext, data_source : any, query : any = {}) => context.app.service('measurements').find({
  query: {
    bucket: data_source.bucket,
    measurement: data_source.measurement,
    tags: data_source.tags,
    drop: ['codingRate'],   // FIX: For duplicate series
    fields: [ data_source.field ],
    period: query?.period,
    start: query?.start,
    stop: query?.stop,
    every: query?.every,
    aliases: {
      [data_source.field]: 'value',
      '_time': 'time',
    },
    pruneTags: true,
  }
});

export async function populate_last_value(context : HookContext) {
  const data = context.result.data || context.result;

  if (Array.isArray(data)) {
    await Promise.all(data.map(async (sensor : any) => {
      sensor.last_value = (await fetch_values(context, sensor.data_source))[0] || {};
    }));
    context.result.data = data;
  } else {
    data.last_value = (await fetch_values(context, data.data_source))[0] || {};
    context.result = data;
  }
  
  return context;
}

export async function populate_values(context : HookContext) {
  const data = context.result.data || context.result;

  if (Array.isArray(data)) {
    await Promise.all(data.map(async (sensor : any) => {
      sensor.values = (await fetch_values(context, sensor.data_source, context.params.query)) || [];
    }));
    context.result.data = data;
  } else {
    data.values = (await fetch_values(context, data.data_source, context.params.query)) || [];
    context.result = data;
  }
  
  return context;
}

export function sanitize_get_sensor(context : HookContext) {
  context.dispatch = {
    id: context.result.id,
    name: context.result.name,
    tree_id: context.result.device.tree.id,
    tree_url: context.result.device.tree.tree_url,
    type: context.result.sensor_type.type,
    description: context.result.sensor_type.description,
    last_value: context.result.last_value,
    values: context.result.values,
    unit: context.result.unit || context.result.sensor_type.unit,
    meta: context.result.meta || {},    // TODO: Why can meta be undefined if required in model?
  };
  context.dispatch.meta.conversion_model_name = context.result.conversion_model?.name;
  delete context.dispatch.meta.conversion_model_id;

  // context.dispatch.original = context.result;    // For testing/debugging
  return context;
}

export function convert_values(context : HookContext) {
  let mapper = new ValueMapper(context.result.conversion_model.samples);

  // Convert unit
  if (context.result.sensor_type.unit === context.result.conversion_model.input_unit) {
    context.result.unit = context.result.conversion_model.output_unit;
  } else {
    throw new Error('Conversion model input unit does not match sample unit');
  }

  if (context.result.values) {
    context.result.values = mapper.convert_values(context.result.values);
  }

  if (context.result.last_value) {
    context.result.last_value = mapper.convert_single(context.result.last_value);
  }

  return context;
}