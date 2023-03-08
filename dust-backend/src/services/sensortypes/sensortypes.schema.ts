// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { NanoIdSchema } from '../../typebox-types/nano_id'

// Main data model schema
export const sensorTypesSchema = Type.Object(
  {
    _id: NanoIdSchema,
    name: Type.String(),
    type: Type.RegEx(/^[a-z0-9-]*$/),
    unit: Type.String(),
    description: Type.String(),
  },
  { $id: 'SensorTypes', additionalProperties: false }
)
export type SensorTypes = Static<typeof sensorTypesSchema>
export const sensorTypesValidator = getValidator(sensorTypesSchema, dataValidator)
export const sensorTypesResolver = resolve<SensorTypes, HookContext>({})

export const sensorTypesExternalResolver = resolve<SensorTypes, HookContext>({})

// Schema for creating new entries
export const sensorTypesDataSchema = Type.Pick(sensorTypesSchema, ['name', 'type', 'unit', 'description'], {
  $id: 'SensorTypesData'
})
export type SensorTypesData = Static<typeof sensorTypesDataSchema>
export const sensorTypesDataValidator = getValidator(sensorTypesDataSchema, dataValidator)
export const sensorTypesDataResolver = resolve<SensorTypes, HookContext>({})

// Schema for updating existing entries
export const sensorTypesPatchSchema = Type.Partial(sensorTypesSchema, {
  $id: 'SensorTypesPatch'
})
export type SensorTypesPatch = Static<typeof sensorTypesPatchSchema>
export const sensorTypesPatchValidator = getValidator(sensorTypesPatchSchema, dataValidator)
export const sensorTypesPatchResolver = resolve<SensorTypes, HookContext>({})

// Schema for allowed query properties
export const sensorTypesQueryProperties = Type.Pick(sensorTypesSchema, ['_id', 'name'])
export const sensorTypesQuerySchema = Type.Intersect(
  [
    querySyntax(sensorTypesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SensorTypesQuery = Static<typeof sensorTypesQuerySchema>
export const sensorTypesQueryValidator = getValidator(sensorTypesQuerySchema, queryValidator)
export const sensorTypesQueryResolver = resolve<SensorTypesQuery, HookContext>({})
