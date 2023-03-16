// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const conversionModelsSchema = Type.Object(
  {
    _id: NanoIdSchema,
    name: Type.String(),
    description: Type.String(),
    input_unit: Type.String(),
    output_unit: Type.String(),
    samples: Type.Array(Type.Object({
      input_value: Type.Number(),
      output_value: Type.Number(),
    }), { minItems: 1 }),
    // Auto-generated fields
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'ConversionModels', additionalProperties: false }
)
export type ConversionModels = Static<typeof conversionModelsSchema>
export const conversionModelsValidator = getValidator(conversionModelsSchema, dataValidator)
export const conversionModelsResolver = resolve<ConversionModels, HookContext>({})

export const conversionModelsExternalResolver = resolve<ConversionModels, HookContext>({})

// Schema for creating new entries
export const conversionModelsDataSchema = Type.Pick(conversionModelsSchema,
  ['name', 'description', 'input_unit', 'output_unit', 'samples'], {
  $id: 'ConversionModelsData'
})
export type ConversionModelsData = Static<typeof conversionModelsDataSchema>
export const conversionModelsDataValidator = getValidator(conversionModelsDataSchema, dataValidator)
export const conversionModelsDataResolver = resolve<ConversionModels, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const conversionModelsPatchSchema = Type.Partial(Type.Omit(conversionModelsSchema, ['createdAt', 'updatedAt']), {
  $id: 'ConversionModelsPatch'
})
export type ConversionModelsPatch = Static<typeof conversionModelsPatchSchema>
export const conversionModelsPatchValidator = getValidator(conversionModelsPatchSchema, dataValidator)
export const conversionModelsPatchResolver = resolve<ConversionModels, HookContext>({})

// Schema for allowed query properties
export const conversionModelsQueryProperties = Type.Pick(conversionModelsSchema, ['_id'])
export const conversionModelsQuerySchema = Type.Intersect(
  [
    querySyntax(conversionModelsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ConversionModelsQuery = Static<typeof conversionModelsQuerySchema>
export const conversionModelsQueryValidator = getValidator(conversionModelsQuerySchema, queryValidator)
export const conversionModelsQueryResolver = resolve<ConversionModelsQuery, HookContext>({})
