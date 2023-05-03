// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { NanoIdSchema } from '../../typebox-types/nano_id'

// Main data model schema
export const sensorTypeSchema = Type.Object(
  {
    // Database fields
    _id: NanoIdSchema,
    name: Type.String(),
    type: Type.RegEx(/^[a-z0-9-]*$/),
    unit: Type.String(),
    description: Type.String(),

    // Auto-generated fields (also stored in database)
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),

  },
  { $id: 'SensorType', additionalProperties: false }
)

// A Typescript type for the schema
export type SensorType = Static<typeof sensorTypeSchema>
export const sensorTypeValidator = getValidator(sensorTypeSchema, dataValidator)



//////////////////////////////////////////////////////////
// RESULT RESOLVERS
//////////////////////////////////////////////////////////

export const sensorTypeResolver = resolve<SensorType, HookContext>({})
export const sensorTypeExternalResolver = resolve<SensorType, HookContext>({})



//////////////////////////////////////////////////////////
// CREATING NEW ENTITIES
//////////////////////////////////////////////////////////

// Schema for creating new entries
export const sensorTypeDataSchema = Type.Intersect([
    Type.Partial(Type.Pick(sensorTypeSchema, ['_id'])),                         // Allow _id but don't require it
    Type.Pick(sensorTypeSchema, ['name', 'type', 'unit', 'description'])
  ], {
  $id: 'SensorTypeData'
})

export type SensorTypeData = Static<typeof sensorTypeDataSchema>
export const sensorTypeDataValidator = getValidator(sensorTypeDataSchema, dataValidator)
export const sensorTypeDataResolver = resolve<SensorType, HookContext>({})



//////////////////////////////////////////////////////////
// UPDATING EXISTING ENTITIES
//////////////////////////////////////////////////////////

// Schema for updating existing entries
export const sensorTypePatchSchema = Type.Partial(sensorTypeSchema, {     // No need to disallow _id here, it is ignored
  $id: 'SensorTypePatch'
})

export type SensorTypePatch = Static<typeof sensorTypePatchSchema>
export const sensorTypePatchValidator = getValidator(sensorTypePatchSchema, dataValidator)
export const sensorTypePatchResolver = resolve<SensorType, HookContext>({})



//////////////////////////////////////////////////////////
// QUERYING ENTITIES
//////////////////////////////////////////////////////////

// Schema for allowed query properties
export const sensorTypeQueryProperties = Type.Pick(sensorTypeSchema, ['_id', 'type'])
export const sensorTypeQuerySchema = Type.Intersect(
  [
    querySyntax(sensorTypeQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)

export type SensorTypeQuery = Static<typeof sensorTypeQuerySchema>
export const sensorTypeQueryValidator = getValidator(sensorTypeQuerySchema, queryValidator)
export const sensorTypeQueryResolver = resolve<SensorTypeQuery, HookContext>({})
