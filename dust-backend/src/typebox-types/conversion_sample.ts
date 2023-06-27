import { Type } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

// TODO: This is probable the way how we should define sub-types.
// Probable need to refactor the others

export const conversionSampleSchema = Type.Object({
  input_value: Type.Number(),
  output_value: Type.Number(),
}, { $id: 'ConversionSample', additionalProperties: false });

export type ConversionSample = Static<typeof conversionSampleSchema>