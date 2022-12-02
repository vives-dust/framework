import Joi from 'joi';

import { ObjectIdSchema } from './partials/objectid';
import { TypePatternSchema } from './partials/type_pattern';

const DeviceTypeCreateSchema = Joi.object().keys({
  _id: ObjectIdSchema,
  name: Joi.string().required(),
  type: TypePatternSchema.required(),
  description: Joi.string().required(),
  image_url: Joi.string().allow('').required(),     // TODO: Do we need to require image ?
});

export const DeviceTypeSchemas = {

  _create: DeviceTypeCreateSchema,

};
