// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { NanoIdSchema } from '../../typebox-types/nano_id'

// Main data model schema
export const conversionModelSchema = Type.Object(
  {
    // Database fields
    _id: NanoIdSchema,
    name: Type.String(),
    description: Type.String(),
    input_unit: Type.String(),
    output_unit: Type.String(),
    samples: Type.Array(Type.Object({
      input_value: Type.Number(),
      output_value: Type.Number(),
    }), { minItems: 1 }),

    // Auto-generated fields (also stored in database)
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),

  },
  { $id: 'ConversionModel', additionalProperties: false }
)
// A Typescript type for the schema
export type ConversionModel = Static<typeof conversionModelSchema>
export const conversionModelValidator = getValidator(conversionModelSchema, dataValidator)



//////////////////////////////////////////////////////////
// RESULT RESOLVERS
//////////////////////////////////////////////////////////

export const conversionModelResolver = resolve<ConversionModel, HookContext>({})
export const conversionModelExternalResolver = resolve<ConversionModel, HookContext>({})



//////////////////////////////////////////////////////////
// CREATING NEW ENTITIES
//////////////////////////////////////////////////////////

// Schema for creating new entries
export const conversionModelDataSchema = Type.Intersect([
  Type.Partial(Type.Pick(conversionModelSchema, ['_id'])),                         // Allow _id but don't require it
  Type.Pick(conversionModelSchema, ['name', 'description', 'input_unit', 'output_unit', 'samples'])
], {
$id: 'ConversionModelData'
})

export type ConversionModelData = Static<typeof conversionModelDataSchema>
export const conversionModelDataValidator = getValidator(conversionModelDataSchema, dataValidator)
export const conversionModelDataResolver = resolve<ConversionModel, HookContext>({})



//////////////////////////////////////////////////////////
// UPDATING EXISTING ENTITIES
//////////////////////////////////////////////////////////

// Schema for updating existing entries
export const conversionModelPatchSchema = Type.Partial(conversionModelSchema, {     // No need to disallow _id here, it is ignored
  $id: 'ConversionModelPatch'
})

export type ConversionModelPatch = Static<typeof conversionModelPatchSchema>
export const conversionModelPatchValidator = getValidator(conversionModelPatchSchema, dataValidator)
export const conversionModelPatchResolver = resolve<ConversionModel, HookContext>({})



//////////////////////////////////////////////////////////
// QUERYING ENTITIES
//////////////////////////////////////////////////////////

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
