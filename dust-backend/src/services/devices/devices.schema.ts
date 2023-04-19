// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { treeSchema } from '../trees/trees.schema'
import { deviceTypeSchema } from '../devicetypes/devicetypes.schema'
import { nanoid } from 'nanoid/async';

// Main data model schema
// This basically contains all possible fields that are available on the model
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
    _tree: Type.Ref(treeSchema),
    _devicetype: Type.Ref(deviceTypeSchema),

    // Computed properties
    device_url: Type.String({ format: 'uri' }),     // A url to the details route of this device

    // Incoming data fields that are not stored in the database
    devicetype: Type.String(),
  },
  { $id: 'Device', additionalProperties: false }
)
// A Typescript type for the device schema
export type Device = Static<typeof deviceSchema>
export const deviceValidator = getValidator(deviceSchema, dataValidator)      // Can't be removed! Can't find reason why not



//////////////////////////////////////////////////////////
// DATA validation for CREATING new entities
//////////////////////////////////////////////////////////

// The schema, typescript type and validator for the data coming from the user with a POST request
export const deviceDataSchema = Type.Pick(deviceSchema,
  ['name', 'description', 'tree_id', 'datasource_key', 'hardware_id', 'devicetype'],
  { $id: 'DeviceData' }
)
export type DeviceData = Static<typeof deviceDataSchema>
export const deviceDataValidator = getValidator(deviceDataSchema, dataValidator)



//////////////////////////////////////////////////////////
//  DATA validation for PATCHING existing entities
//////////////////////////////////////////////////////////

// The schema, typescript type and validator for the data coming from the user with a PATCH request
const devicePatchSchema = Type.Intersect([ Type.Partial(deviceDataSchema), Type.Pick(deviceSchema, ['_id'])], {
  $id: 'DevicePatch'
})
export type DevicePatch = Static<typeof devicePatchSchema>
export const devicePatchValidator = getValidator(devicePatchSchema, dataValidator)


//////////////////////////////////////////////////////////
// QUERY validation for FINDING entities
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



//////////////////////////////////////////////////////////////////////////////
// Data Resolvers
//  - Convert DATA from a create, update or patch
//  - Executed before the data is stored in the database
//  - AROUND (run only on methods with DATA) or BEFORE hook
//  - Usage:
//      - Hash password
//      - Set updatedAt
//      - Remove properties that cannot be written
//      - Populate associations which are required in the creation process
//////////////////////////////////////////////////////////////////////////////

// Set the createdAt and updatedAt fields
// Can be used for both create and patch
export const timestampsDataResolver = resolve<Device, HookContext>({
  createdAt: async (value, device : Device, context : HookContext) => (context.method == 'create') ? (new Date()).toISOString() : value,
  updatedAt: async () => (new Date()).toISOString(),
});

// Set the _id field using a NanoID
export const nanoIdDataResolver = resolve<Device, HookContext>({
  _id: async () => await nanoid(),
});

// Set the devicetype_id based on the populated _devicetype association
export const deviceTypeIdDataResolver = resolve<Device, HookContext>({
  devicetype_id: async (value, device, context) => device._devicetype._id,
});

// Setup a clean version of the device that is to be stored in the database
export const deviceBeforeCreateCleanupDataResolver = resolve<Device, HookContext>({
  devicetype: async () => undefined,
  _devicetype: async () => undefined,
  _tree: async () => undefined,
});


//////////////////////////////////////////////////////////////////////////////
// Generic Data/Result resolvers
//  - Basically only usable for populating associations
//////////////////////////////////////////////////////////////////////////////

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

// Populate the _tree association using the tree_id field
export const treeGenericResolver = resolve<Device, HookContext>({
  _tree: virtual(async (device, context) => {
    return context.app.service('trees').get(device.tree_id)
  }),
});



//////////////////////////////////////////////////////////////////////////////
// Result Resolvers
//  - Manipulate the result returned by a service (get, find, patch, update ...)
//  - Must be used as AROUND hooks
//  - Usage:
//      - Add computed properties
//      - Populate associations
//////////////////////////////////////////////////////////////////////////////


// Set the user friendly devicetype field and provide url to the device
export const deviceResultResolver = resolve<Device, HookContext>({
  devicetype: virtual(async (device, context) => {
    return device._devicetype.type;
  }),
  device_url: virtual(async (device, context) => {
    return `${context.app.get('application').domain}/${context.path}/${device._id}`
  }),
})



//////////////////////////////////////////////////////////////////////////////
// External (or dispatch) Resolvers
//  - Return safe version of the RESULT data that will be send to EXTERNAL clients
//  - Properties can return undefined to be excluded from the result
//  - AROUND of AFTER hook
//  - Usage:
//      - Mainly for removing sensitive or unwanted data
//////////////////////////////////////////////////////////////////////////////


// Cleans up the data before it is being send to the user
export const deviceExternalResolver = resolve<Device, HookContext>({
  _devicetype: async () => undefined,
  _tree: async () => undefined,
  createdAt: async () => undefined,
  updatedAt: async () => undefined,
  devicetype_id: async () => undefined,
})



//////////////////////////////////////////////////////////////////////////////
// Query Resolvers
//  - Modify the query before it is being executed
//  - Properties can return undefined to be excluded from the result
//  - AROUND of BEFORE hook
//  - Usage:
//      - Set default values
//      - Add additional query properties
//      - Limit query options
//////////////////////////////////////////////////////////////////////////////

export const deviceQueryResolver = resolve<DeviceQuery, HookContext>({})
