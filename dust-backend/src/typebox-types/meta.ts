import { Type } from '@feathersjs/typebox'

export const MetaSchema = Type.Object({
  depth: Type.Optional(Type.Integer({ exclusiveMaximum: 0 })),
  conversion_model_name: Type.Optional(Type.String()),
});
