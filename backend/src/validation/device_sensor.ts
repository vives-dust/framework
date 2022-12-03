import Joi from 'joi';

import { ObjectIdSchema } from './partials/objectid';
import { DataSourceSchema } from './partials/datasource';
import { MetaSchema } from './partials/meta';

const DeviceSensorCreateSchema = Joi.object().keys({
  _id: ObjectIdSchema,
  devicetype_id: ObjectIdSchema.required(),
  sensortype_id: ObjectIdSchema.required(),
  data_source: DataSourceSchema.required(),
  meta: MetaSchema.required(),
});

export const DeviceSensorSchemas = {

  _create: DeviceSensorCreateSchema,

};
