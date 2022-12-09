import Joi from 'joi';
import { ImageUrlSchema } from './partials/image_url';
import { MongoObjectIdSchema } from './partials/mongo_object_id';
import { TypePatternSchema } from './partials/type_pattern';

// Management Schema's

const DeviceTypeCreateSchema = Joi.object().keys({
  _id: MongoObjectIdSchema,
  name: Joi.string().required(),
  type: TypePatternSchema.required(),
  description: Joi.string().required(),
  image_url: ImageUrlSchema.required(),
});

export const DeviceTypeSchemas = {

  _create: DeviceTypeCreateSchema,

};