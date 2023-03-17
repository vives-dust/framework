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
    tree: Type.Ref(treeSchema),
    devicetype: Type.Ref(deviceTypeSchema),
  },
  { $id: 'Device', additionalProperties: false }
)
export type Device = Static<typeof deviceSchema>
export const deviceValidator = getValidator(deviceSchema, dataValidator)
export const deviceResolver = resolve<Device, HookContext>({})

export const deviceExternalResolver = resolve<Device, HookContext>({
  devicetype: virtual(async (device, context) => {
    // Populate the devicetype associated with this device
    return context.app.service('devicetypes').get(device.devicetype_id)
  }),
  tree: virtual(async (device, context) => {
    // Populate the tree associated with this device
    return context.app.service('trees').get(device.tree_id)
  }),
  device_url: virtual(async (device, context) => {
    return `${context.app.get('application').domain}/${context.path}/${device._id}`
  })
})

// Schema for creating new entries
export const deviceDataSchema = Type.Pick(deviceSchema,
  ['name', 'description', 'tree_id', 'devicetype_id', 'datasource_key', 'hardware_id'], {
  $id: 'DeviceData'
})
export type DeviceData = Static<typeof deviceDataSchema>
export const deviceDataValidator = getValidator(deviceDataSchema, dataValidator)
export const deviceDataResolver = resolve<Device, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
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
