// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const deviceTypeSchema = Type.Object(
  {
    _id: NanoIdSchema,
    name: Type.String(),
    type: Type.RegEx(/^[a-z0-9-]*$/),
    description: Type.String(),
    image_url: Type.String(),
    // Auto-generated fields
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'DeviceType', additionalProperties: false }
)
export type DeviceType = Static<typeof deviceTypeSchema>
export const deviceTypeValidator = getValidator(deviceTypeSchema, dataValidator)
export const deviceTypeResolver = resolve<DeviceType, HookContext>({})

export const deviceTypeExternalResolver = resolve<DeviceType, HookContext>({})

// Schema for creating new entries
export const deviceTypeDataSchema = Type.Pick(deviceTypeSchema, ['name', 'type', 'description', 'image_url'], {
  $id: 'DeviceTypeData'
})
export type DeviceTypeData = Static<typeof deviceTypeDataSchema>
export const deviceTypeDataValidator = getValidator(deviceTypeDataSchema, dataValidator)
export const deviceTypeDataResolver = resolve<DeviceType, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const deviceTypePatchSchema = Type.Partial(Type.Omit(deviceTypeSchema, ['createdAt', 'updatedAt']), {
  $id: 'DeviceTypePatch'
})
export type DeviceTypePatch = Static<typeof deviceTypePatchSchema>
export const deviceTypePatchValidator = getValidator(deviceTypePatchSchema, dataValidator)
export const deviceTypePatchResolver = resolve<DeviceType, HookContext>({
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for allowed query properties
export const deviceTypeQueryProperties = Type.Pick(deviceTypeSchema, ['_id', 'type'])
export const deviceTypeQuerySchema = Type.Intersect(
  [
    querySyntax(deviceTypeQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DeviceTypeQuery = Static<typeof deviceTypeQuerySchema>
export const deviceTypeQueryValidator = getValidator(deviceTypeQuerySchema, queryValidator)
export const deviceTypeQueryResolver = resolve<DeviceTypeQuery, HookContext>({})
