import { HookContext } from '@feathersjs/feathers';
import { resolveData, hooks as schemaHooks } from '@feathersjs/schema'
import { debug, disallow } from 'feathers-hooks-common';

import { Sensor } from '../sensors/sensors.class';
import { DeviceSensor } from '../devicesensors/devicesensors.class';

import {
  deviceDataValidator,
  nanoIdDataResolver,
  timestampsDataResolver,
  devicePatchValidator,
  deviceQueryValidator,
  deviceResultResolver,
  deviceExternalResolver,
  deviceTypeGenericResolver,
  treeGenericResolver,
  deviceTypeIdDataResolver,
  deviceQueryResolver,
  deviceBeforeCreateCleanupDataResolver,
  deviceSensorsGenericResolver
} from './devices.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(deviceExternalResolver), 
      schemaHooks.resolveResult(
        deviceTypeGenericResolver,    // Need the deviceType for returning the "devicetype" user friendly field
        deviceResultResolver
      ),
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(deviceQueryValidator), 
      schemaHooks.resolveQuery(deviceQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(deviceDataValidator),        // 1. Validate the data coming from the user
      schemaHooks.resolveData(
        nanoIdDataResolver,             // 2. Inject a NanoID as _id
        deviceTypeGenericResolver,      // 3. Populate DeviceType association based on the user provided name
        treeGenericResolver,            // 4. Populate Tree association
        deviceTypeIdDataResolver,       // 5. Set the DeviceType ID based on the populated association
        timestampsDataResolver          // 6. Set timestamps
      ), 
      schemaHooks.resolveData(deviceBeforeCreateCleanupDataResolver), // 7. Cleanup the data before storing it in the database
    ],
    patch: [
      disallow('external'),       // TODO - Fix the patching of external devices
      // schemaHooks.validateData(devicePatchValidator), 
      // schemaHooks.resolveData(devicePatchResolver)
    ],
    remove: []
  },
  after: {
    all: [],
    create: [
      schemaHooks.resolveData(deviceSensorsGenericResolver),    // 1. Populate list of devicesensors that belong to this specific device.
      create_sensors_for_device,
      // 8. resolveResult providers are run next
      // 9. resolveExternal providers are run next
    ]
  },
  error: {
    all: []
  }
};

async function create_sensors_for_device(context : HookContext) {
  // We now need to build sensors based on these devicesensor "descriptions"
  const sensors: Array<Sensor> = context.data._devicesensors.map( (ds : DeviceSensor) => {
    return {
      name: ds._sensortype.name,
      device_id: context.data._id.toString(),      // context.data contains the device for which we are creating sensors
      sensortype_id: ds.sensortype_id.toString(),
      meta: ds.meta,
      data_source: {
        source: ds.data_source.source,
        bucket: ds.data_source.bucket,
        measurement: ds.data_source.measurement,
        // TODO - change any-type to correct type...
        tags: Object.keys(ds.data_source.tags).reduce((newObj: any, tag) => { newObj[tag] = context.result.datasource_key; return newObj; }, {}),
        field: ds.data_source.field
      }
    }
  });

  // Last we need to create all these new sensors
  await Promise.all(sensors.map(async (sensor : Sensor) => {
    await context.app.service('sensors').create(sensor, context.params);      // Pass the params so the user details (role and such) are passed
  }));

  return context;
}