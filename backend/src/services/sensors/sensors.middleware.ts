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

export async function populate_last_value(context : HookContext) {
  context.result.last_value = (await context.app.service('measurements').find({
    query: {
      bucket: context.result.data_source.bucket,
      measurement: context.result.data_source.measurement,
      tags: context.result.data_source.tags,
      drop: ['codingRate'],   // FIX: For duplicate series
      fields: [ context.result.data_source.field ],
      aliases: {
        [context.result.data_source.field]: 'value',
        '_time': 'time',
      },
      pruneTags: true,
    }
  }))[0] || {};

  return context;
}

function sanitize_sensor(sensor : any) {
  return {
    id: sensor.id,
    name: sensor.name,
    tree_id: sensor.device.tree.id,
    tree_url: sensor.device.tree.tree_url,
    type: sensor.sensor_type.type,
    description: sensor.sensor_type.description,
    last_value: sensor.last_value,
    // values: context.result.values,
    unit: sensor.sensor_type.unit,
    meta: sensor.meta || {},    // TODO: Why can meta be undefined if required in model?
  };
}

export function sanitize_get_sensor(context : HookContext) {
  context.dispatch = sanitize_sensor(context.result);
  // context.dispatch.original = context.result;    // For testing/debugging
  return context;
}
