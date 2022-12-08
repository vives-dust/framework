import { default as feathers, HookContext } from '@feathersjs/feathers';

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
        devicetype_id: (await fetch_devicetype(context)).data[0]._id.toString(),
        tree_id: (await fetch_tree(context)).data[0]._id.toString(),
        datasource_key: context.data.datasource_key
    }

    console.log(device)
};

const fetch_devicetype = (context: HookContext) => context.app.service('devicetypes').find({
    query: {
        type: context.data.devicetype
    }
});

const fetch_tree = (context: HookContext) => context.app.service('trees').find({
    query: {
        id: context.data.tree_id
    }
});

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
        "device_id": "636df69de89936aad2253dae"
    }
);

export async function create_sensors(context: HookContext) {
    await create_sensor_entity( context )

    return context;
}

