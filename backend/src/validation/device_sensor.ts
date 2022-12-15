import Joi from 'joi';
import { MongoObjectIdSchema } from './partials/mongo_object_id';
import { DataSourceSpecSchema } from './partials/datasource';
import { MetaSchema } from './partials/meta';

// Management Schema's

const DeviceSensorCreateSchema = Joi.object().keys({
  _id: MongoObjectIdSchema,
  devicetype_id: MongoObjectIdSchema.required(),
  sensortype_id: MongoObjectIdSchema.required(),
  data_source: DataSourceSpecSchema.required(),
  meta: MetaSchema.required(),
});

export const DeviceSensorSchemas = {

  _create: DeviceSensorCreateSchema,

};
