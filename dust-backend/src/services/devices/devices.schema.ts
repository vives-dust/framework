// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import { deviceTypeSchema } from '../devicetypes/devicetypes.schema'
import { treeSchema } from '../trees/trees.schema'
import { deviceSensorSchema } from '../devicesensors/devicesensors.schema'

// Main data model schema
export const deviceSchema = Type.Object(
  {
    // Database fields
    _id: NanoIdSchema,              // The ID of the device
    name: Type.String(),            // A human readable name for the device
    description: Type.String(),     // A description for the device chosen by the user
    tree_id: NanoIdSchema,          // The ID of the tree that this device is associated with
    devicetype_id: NanoIdSchema,    // The ID of the device type that this device is associated with
    datasource_key: Type.String(),  // The key identification of the device in the data source. For example for DUST device this is EUI
    hardware_id: Type.Optional(Type.String()),    // A custom hardware ID that can be assigned to the device (for example a serial number)

    // Auto-generated fields (also stored in database)
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),

    // Associated Data
    _devicetype: Type.Optional(Type.Ref(deviceTypeSchema)),
    _tree: Type.Optional(Type.Ref(treeSchema)),
    _devicesensors: Type.Optional(Type.Array(Type.Ref(deviceSensorSchema))),

    // Computed properties
    resource_url: Type.String({ format: 'uri' }),

    // Incoming data fields that we are not storing in the database
    devicetype: Type.Optional(Type.String()),
  },
  { $id: 'Device', additionalProperties: false }
)

// A Typescript type for the schema
export type Device = Static<typeof deviceSchema>
export const deviceValidator = getValidator(deviceSchema, dataValidator)



//////////////////////////////////////////////////////////
// RESULT RESOLVERS
//////////////////////////////////////////////////////////

export const deviceAssociationResolver = resolve<Device, HookContext>({
  // Populate the _tree association using the tree_id field
  _tree: virtual(async (device, context) => {
     return ( device.tree_id ? context.app.service('trees').get(device.tree_id) : undefined);
  }),
});

export const deviceResolver = resolve<Device, HookContext>({})

export const deviceExternalResolver = resolve<Device, HookContext>({
  _tree: async () => undefined,
})



//////////////////////////////////////////////////////////
// GENERIC DATA RESOLVERS
//////////////////////////////////////////////////////////

// Populate the _devicetype association using the devicetype_id field or if this
// is not set, using the devicetype field which should contain the identifier for the type
export const deviceTypeGenericResolver = resolve<Device, HookContext>({
  _devicetype: virtual(async (device, context) => {
    if (device.devicetype_id) return context.app.service('devicetypes').get(device.devicetype_id);

    const result = await context.app.service('devicetypes').find({ query: { type: context.data.devicetype } });   // TODO Can't seem to disable pagination
    if (result.total == 0) throw new Error('Device type not found');    // TODO - Custom error handling
    return result.data[0];
  }),
});

// Set the devicetype_id based on the populated _devicetype association
export const deviceTypeIdResolver = resolve<Device, HookContext>({
  devicetype_id: async (value, device) => (device._devicetype ? device._devicetype._id : undefined ),
});

// Populate a list of devicesensors that belong to this specific device.
export const deviceSensorsGenericResolver = resolve<Device, HookContext>({
  _devicesensors: virtual(async (device, context) => {
    const result = await context.app.service('devicesensors').find({ query: { devicetype_id: device.devicetype_id } });   // TODO Can't seem to disable pagination
    //if (result.total == 0) throw new Error('Device sensors not found');    // TODO - Custom error handling
    return result.data;
  }),
});


//////////////////////////////////////////////////////////
// CREATING NEW ENTITIES
//////////////////////////////////////////////////////////

// Schema for creating new entries
export const deviceDataSchema = Type.Intersect([
    Type.Partial(Type.Pick(deviceSchema, ['_id'])),                         // Allow _id but don't require it
    Type.Pick(deviceSchema, ['name', 'description', 'tree_id', 'datasource_key', 'hardware_id', 'devicetype'])
  ], {
  $id: 'DeviceData'
})


export type DeviceData = Static<typeof deviceDataSchema>
export const deviceDataValidator = getValidator(deviceDataSchema, dataValidator)
export const deviceDataResolver = resolve<Device, HookContext>({
  devicetype: async () => undefined,
  _devicetype: async () => undefined,
  _tree: async () => undefined,
})


//////////////////////////////////////////////////////////
// UPDATING EXISTING ENTITIES
//////////////////////////////////////////////////////////

// Schema for updating existing entries
export const devicePatchSchema = Type.Partial(
  // Need to Pick here because otherwise we can inject createdAt, resource_url, ...
  // No need to disallow _id here, it is ignored; but it makes API more user friendly
  Type.Pick(deviceSchema, ['_id', 'name', 'description', 'tree_id', 'datasource_key', 'hardware_id']), {    // WARNING ! Device type cannot be changed after creation !
  $id: 'DevicePatch'
})


export type DevicePatch = Static<typeof devicePatchSchema>
export const devicePatchValidator = getValidator(devicePatchSchema, dataValidator)
export const devicePatchResolver = resolve<Device, HookContext>({
  devicetype: async () => undefined,
  _devicetype: async () => undefined,
  _tree: async () => undefined,
})



//////////////////////////////////////////////////////////
// QUERYING ENTITIES
//////////////////////////////////////////////////////////

// Schema for allowed query properties
export const deviceQueryProperties = Type.Pick(deviceSchema, ['_id'])
export const deviceQuerySchema = Type.Intersect(
  [
    querySyntax(deviceQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)

export type DeviceQuery = Static<typeof deviceQuerySchema>
export const deviceQueryValidator = getValidator(deviceQuerySchema, queryValidator)
export const deviceQueryResolver = resolve<DeviceQuery, HookContext>({})
