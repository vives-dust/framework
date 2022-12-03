import Joi from 'joi';
import { NanoidSchema } from './partials/nanoid';
import { MongoObjectIdSchema } from './partials/mongo_object_id';

const DeviceCreateSchema = Joi.object().keys({
  _id: MongoObjectIdSchema,
  id: NanoidSchema.required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  tree_id: MongoObjectIdSchema.required(),
  devicetype_id: MongoObjectIdSchema.required(),
  datasource_key: Joi.string().required()
});
  
export const DeviceSchemas = {

  _create: DeviceCreateSchema,

};