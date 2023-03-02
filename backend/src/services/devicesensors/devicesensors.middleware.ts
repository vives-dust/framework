import { HookContext } from '@feathersjs/feathers';
import { fastJoin } from 'feathers-hooks-common';

// Resolvers are used by fastJoin to populate child object relations
export const devicesensors_resolvers = {
  joins: {
    sensor_type: () => async (devicesensor : any, context : HookContext) => devicesensor.sensortype = (await context.app.service('sensortypes').get(devicesensor.sensortype_id)),
  }
};

export const join_devicesensor_with_sensor_type = fastJoin(devicesensors_resolvers, { sensor_type: true });
