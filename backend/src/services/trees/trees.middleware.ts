import { default as feathers, HookContext } from '@feathersjs/feathers';
import { resource_url } from '../../helpers/domain_url';

export async function populate_devices(context : HookContext) {
  context.result.devices = (await context.app.service('devices').find_by_tree_id(context.id)).data

  return context;
}

export async function populate_sensors(context : HookContext) {
  context.result.sensors = (await Promise.all(context.result.devices.map(async (device : any) => {
    return (await context.app.service('sensors').find_by_device_id(device._id)).data
  }))).flat();

  return context;
}

export function sanitize_single_tree(context : HookContext) {
  // context.dispatch is a writeable, optional property and contains a "safe" version of the data that
  // should be sent to any client. If context.dispatch has not been set context.result will
  //be sent to the client instead.

  // Note: context.dispatch only affects the data sent through a Feathers Transport like REST or Socket.io.
  // An internal method call will still get the data set in context.result.

  context.dispatch = {
    id: context.result.id,
    name: context.result.name,
    description: context.result.description,
    location: context.result.location,
    image_url: context.result.image_url,
    devices: context.result.devices.map((device : any) => {
      return { id: device._id, name: device.name }
    }),
    sensors: context.result.sensors.map((sensor : any) => {
      return {
        id: sensor.id,
        type: sensor.sensortype_id.type,
        name: sensor.sensortype_id.name,
        unit: sensor.sensortype_id.unit,
        device_id: sensor.device_id.id,
        sensor_url: `${resource_url(context.app, "sensors")}/${context.result.sensor.id}`,
        // TODO: Sanitize last value
        // "last_value": {
        //   "time": "2019-10-12T07:20:50.52Z",
        //   "value": 12.1
        // },
      }
    }),

    // original: context.result
  }

  return context;
}

export function sanitize_tree_listing(context : HookContext) {

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
        tree_url: `${resource_url(context.app, "trees")}/${context.result.device_id.tree_id}`,
      }
    })
  }

  return context;
}