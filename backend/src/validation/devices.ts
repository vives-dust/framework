import Joi from 'joi';

import { NanoIdSchema } from './partials/nano_id';

const DeviceCreationSchema = Joi.object().keys({
    id: NanoIdSchema.required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    tree_id: Joi.string().required(),
    datasource_key: Joi.string().required()
});


export const DeviceSchemas = {
  
  _create: DeviceCreationSchema

};