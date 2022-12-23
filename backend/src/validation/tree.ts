import Joi from 'joi';

import { NanoIdSchema } from './partials/nano_id';
import { LocationSchema } from './partials/location';
import { SensorSchemas } from './sensor';
import { PaginationSchema } from './partials/pagination';
import { ImageUrlSchema } from './partials/image_url';
import { ResourceUrlSchema } from './partials/resource_url';

// Public API Schema's

const TreeBaseSchema = Joi.object().keys({
  id: NanoIdSchema.required(),
  location: LocationSchema.required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  image_url: ImageUrlSchema.required(),
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

// Management Schema's


export const TreeSchemas = {

  _base: TreeBaseSchema,

  _get: TreeDetailsSchema,
  _find: PaginatedTreesSchema,

  _create: TreeBaseSchema,          // User input
  _created: TreeBaseSchema,         // Output result

};