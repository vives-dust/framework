import Joi from 'joi';
import { NanoIdSchema } from './partials/nano_id';

const DeviceBaseSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  tree_id: NanoIdSchema.required(),
  devicetype: Joi.string().required(),
  datasource_key: Joi.string().required(),
});

const DeviceCreationSchema = DeviceBaseSchema.keys({
  id: NanoIdSchema.required(),
});

export const DeviceSchemas = {

  _base: DeviceBaseSchema,

  _create: DeviceBaseSchema,          // User input
  _created: DeviceCreationSchema,     // Output result

};