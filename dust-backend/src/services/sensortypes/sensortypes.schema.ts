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
    _id: NanoIdSchema,
    name: Type.String(),
    type: Type.RegEx(/^[a-z0-9-]*$/),
    unit: Type.String(),
    description: Type.String(),
    // Auto-generated fields
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'SensorType', additionalProperties: false }
)
export type SensorType = Static<typeof sensorTypeSchema>
export const sensorTypeValidator = getValidator(sensorTypeSchema, dataValidator)
export const sensorTypeResolver = resolve<SensorType, HookContext>({})

export const sensorTypeExternalResolver = resolve<SensorType, HookContext>({})

// Schema for creating new entries
export const sensorTypeDataSchema = Type.Pick(sensorTypeSchema, ['name', 'type', 'unit', 'description'], {
  $id: 'SensorTypeData'
})
export type SensorTypeData = Static<typeof sensorTypeDataSchema>
export const sensorTypeDataValidator = getValidator(sensorTypeDataSchema, dataValidator)
export const sensorTypeDataResolver = resolve<SensorType, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const sensorTypePatchSchema = Type.Partial(Type.Omit(sensorTypeSchema, ['createdAt', 'updatedAt']), {
  $id: 'SensorTypePatch'
})
export type SensorTypePatch = Static<typeof sensorTypePatchSchema>
export const sensorTypePatchValidator = getValidator(sensorTypePatchSchema, dataValidator)
export const sensorTypePatchResolver = resolve<SensorType, HookContext>({
  updatedAt: async () => (new Date()).toISOString(),
})

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
