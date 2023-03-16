// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { NanoIdSchema } from '../../typebox-types/nano_id'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const conversionModelSchema = Type.Object(
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
  { $id: 'ConversionModel', additionalProperties: false }
)
export type ConversionModel = Static<typeof conversionModelSchema>
export const conversionModelValidator = getValidator(conversionModelSchema, dataValidator)
export const conversionModelResolver = resolve<ConversionModel, HookContext>({})

export const conversionModelExternalResolver = resolve<ConversionModel, HookContext>({})

// Schema for creating new entries
export const conversionModelDataSchema = Type.Pick(conversionModelSchema,
  ['name', 'description', 'input_unit', 'output_unit', 'samples'], {
  $id: 'ConversionModelData'
})
export type ConversionModelData = Static<typeof conversionModelDataSchema>
export const conversionModelDataValidator = getValidator(conversionModelDataSchema, dataValidator)
export const conversionModelDataResolver = resolve<ConversionModel, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for updating existing entries
export const conversionModelPatchSchema = Type.Partial(Type.Omit(conversionModelSchema, ['createdAt', 'updatedAt']), {
  $id: 'ConversionModelPatch'
})
export type ConversionModelPatch = Static<typeof conversionModelPatchSchema>
export const conversionModelPatchValidator = getValidator(conversionModelPatchSchema, dataValidator)
export const conversionModelPatchResolver = resolve<ConversionModel, HookContext>({})

// Schema for allowed query properties
export const conversionModelQueryProperties = Type.Pick(conversionModelSchema, ['_id'])
export const conversionModelQuerySchema = Type.Intersect(
  [
    querySyntax(conversionModelQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ConversionModelQuery = Static<typeof conversionModelQuerySchema>
export const conversionModelQueryValidator = getValidator(conversionModelQuerySchema, queryValidator)
export const conversionModelQueryResolver = resolve<ConversionModelQuery, HookContext>({})
