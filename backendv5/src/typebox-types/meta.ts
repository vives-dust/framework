import { Type } from '@feathersjs/typebox'
import { NanoIdSchema } from './nano_id'
// import { conversionModelSchema } from '../services/conversionmodels/conversionmodels.schema';    // TODO: Add this back in when we have a conversion model service

export const MetaSchema = Type.Object({
  // DB fields
  depth: Type.Optional(Type.Integer({ exclusiveMaximum: 0 })),
  conversion_model_id: Type.Optional(NanoIdSchema),

  // Computed properties
  conversion_model_name: Type.Optional(Type.String()),
}, { $id: 'Meta', additionalProperties: false });
