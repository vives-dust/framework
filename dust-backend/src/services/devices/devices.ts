// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  deviceDataValidator,
  devicePatchValidator,
  deviceQueryValidator,
  deviceResolver,
  deviceExternalResolver,
  deviceDataResolver,
  devicePatchResolver,
  deviceQueryResolver,
  deviceTypeGenericResolver,
  treeGenericResolver,
  deviceTypeIdResolver,
  deviceSensorsGenericResolver
} from './devices.schema'

import type { Application } from '../../declarations'
import { DeviceService, getOptions } from './devices.class'
import { devicePath, deviceMethods } from './devices.shared'
import { nanoIdDataResolver, timestampsDataResolver } from '../../resolvers/data.resolvers'
import { removeTimeStampsExternalResolver } from '../../resolvers/external.resolvers'
import { setResourceUrlExternalResolver } from '../../resolvers/result.resolvers'
import { HookContext } from '@feathersjs/feathers';

// import { Sensor } from '../sensors/sensors.class';
import { DeviceSensor } from '../devicesensors/devicesensors.class';

export * from './devices.class'
export * from './devices.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const device = (app: Application) => {
  // Register our service on the Feathers application
  app.use(devicePath, new DeviceService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(devicePath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(
          deviceExternalResolver,
          removeTimeStampsExternalResolver,
        ),
        schemaHooks.resolveResult(
          deviceResolver,
          setResourceUrlExternalResolver,
        )
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
        schemaHooks.validateData(deviceDataValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          nanoIdDataResolver,
          timestampsDataResolver,
          // Populate associations (this will make sure the ref id's to the associations exist)
          deviceTypeGenericResolver,      // Populate DeviceType association based on the user provided name
          treeGenericResolver,            // Populate Tree association
          deviceTypeIdResolver,           // Set the DeviceType ID based on the populated association _devicetype
        ),
        schemaHooks.resolveData(deviceDataResolver)     // Cleanup the data before storing it in the database
      ],
      patch: [
        schemaHooks.validateData(devicePatchValidator),
        // Can't run this in "all" hook since we first need to validate before injecting extra props
        schemaHooks.resolveData(
          timestampsDataResolver,
          // Populate only tree for patch since we do not allow type to be changed (would require sensors to be deleted and recreated)
          treeGenericResolver,            // Populate Tree association
        ),
        schemaHooks.resolveData(devicePatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],
      create: [
        schemaHooks.resolveData(deviceSensorsGenericResolver),    // Populate list of devicesensors that belong to this specific device.
        create_sensors_for_device,
      ]
    },
    error: {
      all: []
    }
  })
}

async function create_sensors_for_device(context : HookContext) {
  // // We now need to build sensors based on these devicesensor "descriptions"
  // const sensors: Array<Sensor> = context.data._devicesensors.map( (ds : DeviceSensor) => {
  //   return {
  //     name: ds._sensortype.name,
  //     device_id: context.data._id.toString(),      // context.data contains the device for which we are creating sensors
  //     sensortype_id: ds.sensortype_id.toString(),
  //     meta: ds.meta,
  //     data_source: {
  //       source: ds.data_source.source,
  //       bucket: ds.data_source.bucket,
  //       measurement: ds.data_source.measurement,
  //       // TODO - change any-type to correct type...
  //       tags: Object.keys(ds.data_source.tags).reduce((newObj: any, tag) => { newObj[tag] = context.result.datasource_key; return newObj; }, {}),
  //       field: ds.data_source.field
  //     }
  //   }
  // });

  // // Last we need to create all these new sensors
  // await Promise.all(sensors.map(async (sensor : Sensor) => {
  //   await context.app.service('sensors').create(sensor, context.params);      // Pass the params so the user details (role and such) are passed
  // }));

  return context;
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [devicePath]: DeviceService
  }
}
