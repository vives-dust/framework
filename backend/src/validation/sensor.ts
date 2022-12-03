import Joi from 'joi';

import { SampleSchema } from './partials/sample';
import { NanoIdSchema } from './partials/nano_id';
import { TypePatternSchema } from './partials/type_pattern';
import { MongoObjectIdSchema } from './partials/mongo_object_id';
import { MetaSchema } from './partials/meta';
import { UnitSchema } from './partials/unit';
import { ResourceUrlSchema } from './partials/resource_url';

const SensorBaseSchema = Joi.object().keys({
  id: NanoIdSchema.required(),
  name: Joi.string().required(),
  type: TypePatternSchema.required(),
  unit: UnitSchema.required(),
  last_value: SampleSchema.required(),
});

// We can extend base schema keys
const SensorDetailsSchema = SensorBaseSchema.keys({
  tree_id: NanoIdSchema.required(),
  tree_url: ResourceUrlSchema.required(),
  description: Joi.string().required(),
  values: Joi.array().items(
    SampleSchema
  ),
  meta: MetaSchema.required(),
});

const SensorCreateSchema = Joi.object().keys({
  _id: MongoObjectIdSchema,
  id: NanoIdSchema.required(),
  name: Joi.string().required(),
  type: TypePatternSchema.required(),
  tree_id: NanoIdSchema.required(),
  tree_url: ResourceUrlSchema.required(),
  description: Joi.string().required(),
  unit: UnitSchema.required(),
  meta: MetaSchema.required(),
});

export const SensorSchemas = {
  _base: SensorBaseSchema,
  _details: SensorDetailsSchema,
  
  _get: SensorDetailsSchema,
  _create: SensorCreateSchema
};