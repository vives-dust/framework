import { default as feathers, HookContext } from '@feathersjs/feathers';

// Resolvers are used by fastJoin to populate child object relations
export const tree_resolvers = {
  joins: {
    devices: () => async (tree : any, context: HookContext) => tree.devices = await context.app.service('devices').find({
      query: { tree_id: tree._id },
      paginate: false
    }),

    sensors_and_their_types: {
      resolver: () => async (tree : any, context: HookContext) => {
        const device_ids = tree.devices.map((device : any) => device._id);
        return tree.sensors = await context.app.service('sensors').find({
          query: { device_id: { $in: device_ids } },
          paginate: false
        });
      },
      joins: {
        joins: {
          types: () => async (sensor : any, context: HookContext) => sensor.sensor_type = (await context.app.service('sensortypes').get(sensor.sensortype_id)),
          device: () => async (sensor : any, context: HookContext) => sensor.device = (await context.app.service('devices').get(sensor.device_id)),
        }
      }
    },

  }
};

export function sanitize_get_tree(context : HookContext) {
  context.dispatch = {
    id: context.result.id,
    name: context.result.name,
    description: context.result.description,
    location: context.result.location,
    image_url: context.result.image_url,
    devices: context.result.devices.map((device : any) => {
      return { id: device.id, name: device.name };
    }),
    sensors: context.result.sensors.map((sensor : any) => {
      return {
        id: sensor.id,
        type: sensor.sensor_type.type,
        name: sensor.sensor_type.name,
        unit: sensor.sensor_type.unit,
        device_id: sensor.device.id,
        sensor_url: sensor.sensor_url,
        last_value: sensor.last_value,
      };
    }),
  };
  // context.dispatch.original = context.result;    // For testing/debugging
  return context;
}

export function sanitize_find_trees(context : HookContext) {
  context.dispatch = {
    total: context.result.total,
    limit: context.result.limit,
    skip: context.result.skip,

    data: context.result.data.map((tree : any) => {
      return {
        id: tree.id,
        name: tree.name,
        description: tree.description,
        location: tree.location,
        image_url: tree.image_url,
        tree_url:  tree.tree_url
      };
    })
  };
  // context.dispatch.original = context.result;    // For testing/debugging
  return context;
}