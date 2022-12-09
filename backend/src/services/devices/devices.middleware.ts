import { default as feathers, HookContext } from '@feathersjs/feathers';
import { callingParams } from 'feathers-hooks-common';

// Interfaces
export interface DeviceParams {
    name: string,
    description: string,
    devicetype_id: string,             // This will be a hardcoded string that complies with the devicetype name
    tree_id: string,                // This will be a nanoId and needs to be MongoDB ObjectId for internal use
    datasource_key: string
};

// Device creation
export async function create_device(context: HookContext) {   
    const device: DeviceParams = {
        name: context.data.name,
        description: context.data.description,
        devicetype_id: (await fetch_devicetype(context))[0]._id.toString(),
        tree_id: (await fetch_tree(context))[0]._id.toString(),
        datasource_key: context.data.datasource_key
    }

    inject_device_params( device, context )

    return context
};

const fetch_devicetype = (context: HookContext) => context.app.service('devicetypes').find({
    query: { type: context.data.devicetype },
    paginate: false
});

const fetch_tree = (context: HookContext) => context.app.service('trees').find({
    query: { id: context.data.tree_id },
    paginate: false
});

async function inject_device_params( device : DeviceParams, context: HookContext ) {
    context.data.name = device.name
    context.data.description = device.description
    context.data.devicetype_id = device.devicetype_id
    context.data.tree_id = device.tree_id
    context.data.datasource_key = device.datasource_key

    return context
}

// sensor creation
const create_sensor_entity = ( context: HookContext ) => context.app.service('sensors').create({
        "sensortype_id": "636dec5dd73da24da581d973",
        "name": "Internal Temperature Sensor",
        "meta": {},
        "data_source": {
            "source": "influxdb",
            "bucket": "dust",
            "measurement": "dust-sensor",
            "tags": {
                "devId": context.data.datasource_key
            },
            "field": "internalTemperature"
        },
        "device_id": context.result._id.toString()
    }
);

export async function create_sensors(context: HookContext) {
    await create_sensor_entity( context )

    return context;
}

