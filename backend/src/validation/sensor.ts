import Joi from 'joi';

import { SampleSchema } from './partials/sample';
import { NanoidSchema } from './partials/nanoid';
import { TypePatternSchema } from './partials/type_pattern';
import { ObjectIdSchema } from './partials/objectid';
import { MetaPatternSchema } from './partials/meta_pattern';

const SensorBaseSchema = Joi.object().keys({
  id: NanoidSchema.required(),
  name: Joi.string().required(),
  type: TypePatternSchema.required(),
  unit: Joi.string().allow('').required(),
  last_value: SampleSchema.required(),
});

// We can extend base schema keys
const SensorDetailsSchema = SensorBaseSchema.keys({
  tree_id: NanoidSchema.required(),
  tree_url: Joi.string().uri().required(),
  description: Joi.string().required(),
  values: Joi.array().items(
    SampleSchema
  ),
  meta: Joi.object().keys({
    depth: Joi.number(),
    conversion_model_name: Joi.string(),
  }).required(),
});

const SensorCreateSchema = Joi.object().keys({
  _id: ObjectIdSchema,
  id: NanoidSchema.required(),
  name: Joi.string().required(),
  type: TypePatternSchema.required(),
  tree_id: NanoidSchema.required(),
  tree_url: Joi.string().uri().required(),
  description: Joi.string().required(),
  unit: Joi.string().allow('').required(),
  meta: MetaPatternSchema.required()
});

export const SensorSchemas = {
  _base: SensorBaseSchema,
  _details: SensorDetailsSchema,
  
  _get: SensorDetailsSchema,
  _create: SensorCreateSchema
};