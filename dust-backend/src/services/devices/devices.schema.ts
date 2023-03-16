// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { treesSchema } from '../trees/trees.schema'
import { deviceTypesSchema } from '../devicetypes/devicetypes.schema'

// Main data model schema
export const devicesSchema = Type.Object(
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
    device_url: Type.String(),
    // Associated Data
    tree: Type.Ref(treesSchema),
    devicetype: Type.Ref(deviceTypesSchema),
  },
  { $id: 'Devices', additionalProperties: false }
)
export type Devices = Static<typeof devicesSchema>
export const devicesValidator = getValidator(devicesSchema, dataValidator)
export const devicesResolver = resolve<Devices, HookContext>({
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

export const devicesExternalResolver = resolve<Devices, HookContext>({})

// Schema for creating new entries
export const devicesDataSchema = Type.Pick(devicesSchema,
  ['name', 'description', 'tree_id', 'devicetype_id', 'datasource_key', 'hardware_id'], {
  $id: 'DevicesData'
})
export type DevicesData = Static<typeof devicesDataSchema>
export const devicesDataValidator = getValidator(devicesDataSchema, dataValidator)
export const devicesDataResolver = resolve<Devices, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const devicesPatchSchema = Type.Partial(Type.Omit(devicesSchema, ['createdAt', 'updatedAt']), {
  $id: 'DevicesPatch'
})
export type DevicesPatch = Static<typeof devicesPatchSchema>
export const devicesPatchValidator = getValidator(devicesPatchSchema, dataValidator)
export const devicesPatchResolver = resolve<Devices, HookContext>({})

// Schema for allowed query properties
export const devicesQueryProperties = Type.Pick(devicesSchema, ['_id'])
export const devicesQuerySchema = Type.Intersect(
  [
    querySyntax(devicesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DevicesQuery = Static<typeof devicesQuerySchema>
export const devicesQueryValidator = getValidator(devicesQuerySchema, queryValidator)
export const devicesQueryResolver = resolve<DevicesQuery, HookContext>({})
