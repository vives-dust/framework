import Joi from 'joi';

import { NanoidSchema } from './partials/nanoid';

const DeviceCreationSchema = Joi.object().keys({
    id: NanoidSchema.required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    tree_id: Joi.string().required(),
    datasource_key: Joi.string().required()
});


export const DeviceSchemas = {
  
  _create: DeviceCreationSchema

};