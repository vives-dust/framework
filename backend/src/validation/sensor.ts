import Joi from 'joi';

import { SampleSchema } from './partials/sample';
import { NanoidSchema } from './partials/nanoid';

const SensorSchema = Joi.object().keys({
  id: NanoidSchema.required(),
  name: Joi.string().required(),
  tree_id: NanoidSchema.required(),
  tree_url: Joi.string().uri().required(),
  type: Joi.string().required(),
  description: Joi.string().required(),
  last_value: SampleSchema.required(),
  unit: Joi.string().required(),
  meta: Joi.object().keys({
    depth: Joi.number(),
    conversion_model_name: Joi.string(),
  }).required(),
});

export const SensorSchemas = {

  _get: SensorSchema

};