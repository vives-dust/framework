import { default as feathers, HookContext } from '@feathersjs/feathers';
import { iffElse } from 'feathers-hooks-common';
import { Container } from 'winston';

// Interfaces
export interface DeviceParams {
    name: string,
    description: string,
    devicetype_id: string,             // This will be a hardcoded string that maps with the devicetype name
    tree_id: string,                // This will be a nanoId and needs to be MongoDB ObjectId for internal use
    datasource_key: string
};

export interface SensorParams {
    name: string,
    device_id: string,
    sensortype_id: string,
    meta: Object,
    data_source: {
        source: string,
        bucket: string,
        measurement: string,
        tags: Object,
        field: string
    }
}

// Device creation
export async function create_device(context: HookContext) {
    const device: DeviceParams = {
        name: context.data.name,
        description: context.data.description,
        devicetype_id: (await fetch_devicetype_via_name(context))[0]._id.toString(),
        tree_id: (await fetch_tree_via_nanoId(context))[0]._id.toString(),
        datasource_key: context.data.datasource_key
    }
    context.data = device
    return context
};

// Fetch certain information from the mongoDB
// To Do: combine fetches and check for what type of query should be performed
const fetch_devicetype_via_name = (context: HookContext) => context.app.service('devicetypes').find({
    query: { type: context.data.devicetype },
    paginate: false
});

const fetch_devicetype_via_id = (context: HookContext) => context.app.service('devicetypes').find({
    query: { _id: context.result.devicetype_id },
    paginate: false
});

const fetch_tree_via_nanoId = (context: HookContext, mongoDB?: String) => context.app.service('trees').find({ 
    query: { id: context.data.tree_id }, 
    paginate: false
});

const fetch_tree_via_ObjectId = (context: HookContext, objectId: string) => context.app.service('trees').find({
    query: { _id: objectId },
    paginate: false
});

const fetch_devicesensors = (context: HookContext) => context.app.service('devicesensors').find({
    query: { devicetype_id: context.result.devicetype_id},
    paginate: false
})

const fetch_sensortype = (context: HookContext, data: any ) => context.app.service('sensortypes').find({
    query: { _id: data.sensortype_id.toString() },
    paginate: false
});

// Sensor creation
const create_sensor_entity = ( context: HookContext, sensor_template: SensorParams ) => context.app.service('sensors').create(sensor_template);

export async function create_sensors(context: HookContext) {
    const devicesensors: Array<Object> = await fetch_devicesensors(context)
    
    devicesensors.forEach(async (devicesensor: any) => {
        const sensor_template: SensorParams = {
            name: (await fetch_sensortype(context, devicesensor))[0].name,
            device_id: context.result.id,
            sensortype_id: devicesensor.sensortype_id.toString(),
            meta: devicesensor.meta,
            data_source: {
                source: devicesensor.data_source.source,
                bucket: devicesensor.data_source.bucket,
                measurement: devicesensor.data_source.measurement,
                // To Do: change any-type to correct type...
                tags: Object.keys(devicesensor.data_source.tags).reduce((newObj: any, tag) => { newObj[tag] = context.data.datasource_key; return newObj; }, {}),
                field: devicesensor.data_source.field
            }
        }
        create_sensor_entity(context, sensor_template)
    });

    return context;
}

// Sanitisation
export async function sanitize_create_device(context: HookContext) {
    context.dispatch = {
        id: context.result.id,
        name: context.result.name,
        description: context.result.description,
        tree_id: (await fetch_tree_via_ObjectId(context, context.result.tree_id))[0].id.toString(),
        devicetype: (await fetch_devicetype_via_id(context))[0].type,
        datasource_key: context.result.datasource_key
    }
    //context.dispatch.original = context.result;    // For testing/debugging
    return context
}