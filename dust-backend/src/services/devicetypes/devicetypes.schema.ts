// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { NanoIdSchema } from '../../typebox-types/nano_id'

// Main data model schema
export const deviceTypeSchema = Type.Object(
  {
    // Database fields
    _id: NanoIdSchema,
    name: Type.String(),
    type: Type.RegEx(/^[a-z0-9-]*$/),
    description: Type.String(),
    image_url: Type.String(),

    // Auto-generated fields (also stored in database)
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),

  },
  { $id: 'DeviceType', additionalProperties: false }
)

// A Typescript type for the schema
export type DeviceType = Static<typeof deviceTypeSchema>
export const deviceTypeValidator = getValidator(deviceTypeSchema, dataValidator)



//////////////////////////////////////////////////////////
// RESULT RESOLVERS
//////////////////////////////////////////////////////////

export const deviceTypeResolver = resolve<DeviceType, HookContext>({})
export const deviceTypeExternalResolver = resolve<DeviceType, HookContext>({})



//////////////////////////////////////////////////////////
// CREATING NEW ENTITIES
//////////////////////////////////////////////////////////

// Schema for creating new entries
export const deviceTypeDataSchema = Type.Intersect([
    Type.Partial(Type.Pick(deviceTypeSchema, ['_id'])),                         // Allow _id but don't require it
    Type.Pick(deviceTypeSchema, ['name', 'type', 'description', 'image_url'])
  ], {
  $id: 'DeviceTypeData'
})

export type DeviceTypeData = Static<typeof deviceTypeDataSchema>
export const deviceTypeDataValidator = getValidator(deviceTypeDataSchema, dataValidator)
export const deviceTypeDataResolver = resolve<DeviceType, HookContext>({})



//////////////////////////////////////////////////////////
// UPDATING EXISTING ENTITIES
//////////////////////////////////////////////////////////

// Schema for updating existing entries
export const deviceTypePatchSchema = Type.Partial(deviceTypeSchema, {     // No need to disallow _id here, it is ignored
  $id: 'DeviceTypePatch'
})

export type DeviceTypePatch = Static<typeof deviceTypePatchSchema>
export const deviceTypePatchValidator = getValidator(deviceTypePatchSchema, dataValidator)
export const deviceTypePatchResolver = resolve<DeviceType, HookContext>({})



//////////////////////////////////////////////////////////
// QUERYING ENTITIES
//////////////////////////////////////////////////////////

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
