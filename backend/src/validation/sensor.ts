import Joi from 'joi';

import { SampleSchema } from './partials/sample';
import { NanoidSchema } from './partials/nanoid';

const SensorBaseSchema = Joi.object().keys({
  id: NanoidSchema.required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  unit: Joi.string().required(),
  last_value: SampleSchema.required(),
});

// We can extend base schema keys
const SensorDetailsSchema = SensorBaseSchema.keys({
  tree_id: NanoidSchema.required(),
  tree_url: Joi.string().uri().required(),
  description: Joi.string().required(),
  values: Joi.array().min(1).items(
    SampleSchema
  ),
  meta: Joi.object().keys({
    depth: Joi.number(),
    conversion_model_name: Joi.string(),
  }).required(),
})

export const SensorSchemas = {

  _base: SensorBaseSchema,
  _details: SensorDetailsSchema,
  
  _get: SensorDetailsSchema

};