// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const deviceTypesSchema = Type.Object(
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
  { $id: 'DeviceTypes', additionalProperties: false }
)
export type DeviceTypes = Static<typeof deviceTypesSchema>
export const deviceTypesValidator = getValidator(deviceTypesSchema, dataValidator)
export const deviceTypesResolver = resolve<DeviceTypes, HookContext>({})

export const deviceTypesExternalResolver = resolve<DeviceTypes, HookContext>({})

// Schema for creating new entries
export const deviceTypesDataSchema = Type.Pick(deviceTypesSchema, ['name', 'type', 'description', 'image_url'], {
  $id: 'DeviceTypesData'
})
export type DeviceTypesData = Static<typeof deviceTypesDataSchema>
export const deviceTypesDataValidator = getValidator(deviceTypesDataSchema, dataValidator)
export const deviceTypesDataResolver = resolve<DeviceTypes, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const deviceTypesPatchSchema = Type.Partial(Type.Omit(deviceTypesSchema, ['createdAt', 'updatedAt']), {
  $id: 'DeviceTypesPatch'
})
export type DeviceTypesPatch = Static<typeof deviceTypesPatchSchema>
export const deviceTypesPatchValidator = getValidator(deviceTypesPatchSchema, dataValidator)
export const deviceTypesPatchResolver = resolve<DeviceTypes, HookContext>({
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for allowed query properties
export const deviceTypesQueryProperties = Type.Pick(deviceTypesSchema, ['_id', 'type'])
export const deviceTypesQuerySchema = Type.Intersect(
  [
    querySyntax(deviceTypesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DeviceTypesQuery = Static<typeof deviceTypesQuerySchema>
export const deviceTypesQueryValidator = getValidator(deviceTypesQuerySchema, queryValidator)
export const deviceTypesQueryResolver = resolve<DeviceTypesQuery, HookContext>({})
