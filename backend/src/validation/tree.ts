import Joi from 'joi';

import { NanoidSchema } from './partials/nanoid';
import { LocationSchema } from './partials/location';
import { SensorSchemas } from './sensor';

const TreeBaseSchema = Joi.object().keys({
  id: NanoidSchema.required(),
  location: LocationSchema,
  name: Joi.string().required(),
  description: Joi.string().required(),
  image_url: Joi.string().uri().required(),
  devices: Joi.array().items(Joi.object().keys({
    id: NanoidSchema.required(),
    name: Joi.string().required(),
  })).required(),
  sensors: Joi.array().items(SensorSchemas._base.keys({
    sensor_url: Joi.string().uri().required(),
  })).required(),
})

export const TreeSchemas = {

  _base: TreeBaseSchema,

  _get: TreeBaseSchema

};