// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { treeSchema } from '../trees/trees.schema'
import { deviceTypeSchema } from '../devicetypes/devicetypes.schema'

// Main data model schema
export const deviceSchema = Type.Object(
  {
    _id: NanoIdSchema,
    name: Type.String(),
    description: Type.String(),
    tree_id: NanoIdSchema,
    devicetype_id: NanoIdSchema,
    devicetype: Type.String(),
    // The key identification of the device in the data source. For example for DUST device this is EUI
    datasource_key: Type.String(),
    // A custom hardware ID that can be assigned to the device (for example a serial number)
    hardware_id: Type.Optional(Type.String()),
    // Auto-generated fields
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    // Auto-generated virtual fields
    device_url: Type.String({ format: 'uri' }),
    // Associated Data
    _tree: Type.Ref(treeSchema),
    _devicetype: Type.Ref(deviceTypeSchema),
  },
  { $id: 'Device', additionalProperties: false }
)
export type Device = Static<typeof deviceSchema>
export const deviceValidator = getValidator(deviceSchema, dataValidator)

// Can be used to populate the result with associated data
export const deviceTypeResultResolver = resolve<Device, HookContext>({
  _devicetype: virtual(async (device, context) => {
    // Populate the devicetype associated with this device
    return context.app.service('devicetypes').get(device.devicetype_id);
  }),
});
export const deviceResolver = resolve<Device, HookContext>({
  devicetype: virtual(async (device, context) => {
    return device._devicetype.type;
  }),
  device_url: virtual(async (device, context) => {
    return `${context.app.get('application').domain}/${context.path}/${device._id}`
  }),
})

// Cleans up the data before it is being send to the user
export const deviceExternalResolver = resolve<Device, HookContext>({
  _devicetype: async () => undefined,
  _tree: async () => undefined,
  createdAt: async () => undefined,
  updatedAt: async () => undefined,
  devicetype_id: async () => undefined,
})

// Schema for creating new entries
// Here we divert from the general flow of creating entities as the provided
// user data is different from the data that is stored in the database.
export const deviceDataSchema = Type.Pick(deviceSchema,
  ['name', 'description', 'tree_id', 'datasource_key', 'hardware_id', 'devicetype'],
  { $id: 'DeviceData' }
)

export type DeviceData = Static<typeof deviceDataSchema>
export const deviceDataValidator = getValidator(deviceDataSchema, dataValidator)

// The following three resolvers should be run in sequence
export const deviceTypeResolver = resolve<Device, HookContext>({
  _devicetype: virtual(async (device, context) => {
    // Populate the devicetype associated with this device
    const deviceType = await context.app.service('devicetypes').find({ query: { type: context.data.devicetype } });
    if (deviceType.total == 0) throw new Error('Device type not found');    // TODO - Better error handling
    return deviceType.data[0];
  }),
})

export const deviceTreeResolver = resolve<Device, HookContext>({
  _tree: virtual(async (device, context) => {
    // Populate the tree associated with this device
    return context.app.service('trees').get(device.tree_id)
  }),
})

export const deviceDataResolver = resolve<Device, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
  devicetype_id: virtual(async (device, context) => {
    // Populate the devicetype_id
    return device._devicetype._id
  }),
  _devicetype: async () => undefined,
  _tree: async () => undefined,
})

// Schema for updating existing entries
export const devicePatchSchema = Type.Partial(Type.Omit(deviceSchema, ['createdAt', 'updatedAt']), {
  $id: 'DevicePatch'
})
export type DevicePatch = Static<typeof devicePatchSchema>
export const devicePatchValidator = getValidator(devicePatchSchema, dataValidator)
export const devicePatchResolver = resolve<Device, HookContext>({
  updatedAt: async () => (new Date()).toISOString(),
})

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
