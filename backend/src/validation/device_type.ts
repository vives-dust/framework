import Joi from 'joi';
import { ImageSchema } from './partials/image';

import { ObjectIdSchema } from './partials/objectid';
import { TypePatternSchema } from './partials/type_pattern';

const DeviceTypeCreateSchema = Joi.object().keys({
  _id: ObjectIdSchema,
  name: Joi.string().required(),
  type: TypePatternSchema.required(),
  description: Joi.string().required(),
  image_url: ImageSchema
});

export const DeviceTypeSchemas = {

  _create: DeviceTypeCreateSchema,

};
