import { Type } from '@feathersjs/typebox'
import { NanoIdSchema } from './nano_id'
import { conversionModelSchema } from '../services/conversionmodels/conversionmodels.schema';

export const MetaSchema = Type.Object({
  depth: Type.Optional(Type.Integer({ exclusiveMaximum: 0 })),
  conversion_model_id: Type.Optional(NanoIdSchema),
  // Associated Data
  conversion_model: Type.Optional(Type.Ref(conversionModelSchema)),
});
