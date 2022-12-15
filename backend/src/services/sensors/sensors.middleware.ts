import { default as feathers, HookContext } from '@feathersjs/feathers';

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
    unit: context.result.sensor_type.unit,
    meta: context.result.meta || {},    // TODO: Why can meta be undefined if required in model?
  };
  // context.dispatch.original = context.result;    // For testing/debugging
  return context;
}

// Convert nanoId to MongoDB ObjectID
export async function id_conversion(context: HookContext) {
  context.data.device_id = (await fetch_device(context))[0]._id.toString()
  return context
}

const fetch_device = (context: HookContext) => context.app.service('devices').find({
  query: { id: context.data.device_id },
  paginate: false
});
