import Joi from 'joi';

import { ObjectIdSchema } from './partials/objectid';

const SensorCreateSchema = Joi.object().keys({
  _id: ObjectIdSchema,
  name: Joi.string().required(),
  type: Joi.string().pattern(new RegExp('^[a-z0-9,-]*$')).required(),
  unit: Joi.string().allow('').required(),
  description: Joi.string().required(),
});

export const SensorTypeSchemas = {

  _create: SensorCreateSchema,

};