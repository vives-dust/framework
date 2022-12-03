import Joi from 'joi';

import { NanoIdSchema } from './partials/nano_id';
import { LocationSchema } from './partials/location';
import { SensorSchemas } from './sensor';
import { PaginationSchema } from './partials/pagination';
import { MongoObjectIdSchema } from './partials/mongo_object_id';
import { ImageUrlSchema } from './partials/image_url';
import { ResourceUrlSchema } from './partials/resource_url';

const TreeBaseSchema = Joi.object().keys({
  id: NanoIdSchema.required(),
  location: LocationSchema.required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  image_url: ImageUrlSchema,
});

const TreeDetailsSchema = TreeBaseSchema.keys({
  devices: Joi.array().items(Joi.object().keys({
    id: NanoIdSchema.required(),
    name: Joi.string().required(),
  })).required(),
  sensors: Joi.array().items(SensorSchemas._base.keys({
    sensor_url: ResourceUrlSchema.required(),
    device_id: NanoIdSchema.required(),
  })).required(),
});

const PaginatedTreesSchema = PaginationSchema.keys({
  data: Joi.array().items(
    TreeBaseSchema.keys({
      tree_url: ResourceUrlSchema.required(),
    })
  ).required(),
});

const TreeCreateSchema = Joi.object().keys({
  _id: MongoObjectIdSchema,
  id: NanoIdSchema.required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  location: LocationSchema.required(),
  image_url: ImageUrlSchema
});

export const TreeSchemas = {

  _base: TreeBaseSchema,

  _get: TreeDetailsSchema,
  _find: PaginatedTreesSchema,
  _create: TreeCreateSchema,
};