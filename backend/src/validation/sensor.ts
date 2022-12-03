import Joi from 'joi';

import { SampleSchema } from './partials/sample';
import { NanoIdSchema } from './partials/nano_id';
import { TypePatternSchema } from './partials/type_pattern';
import { MetaSchema } from './partials/meta';
import { UnitSchema } from './partials/unit';
import { ResourceUrlSchema } from './partials/resource_url';
import { MongoObjectIdSchema } from './partials/mongo_object_id';
import { DataSourceSchema } from './partials/datasource';

// Public API Schema's

const SensorBaseSchema = Joi.object().keys({
  id: NanoIdSchema.required(),
  name: Joi.string().required(),
  type: TypePatternSchema.required(),
  unit: UnitSchema.required(),
  last_value: SampleSchema.required(),
});

const SensorDetailsSchema = SensorBaseSchema.keys({
  tree_id: NanoIdSchema.required(),
  tree_url: ResourceUrlSchema.required(),
  description: Joi.string().required(),
  meta: MetaSchema.required(),
});

const SensorDetailsWithValuesSchema = SensorDetailsSchema.keys({
  values: Joi.array().items(
    SampleSchema
  ),
});

// Management Schema's

const SensorCreateSchema = Joi.object().keys({
  _id: MongoObjectIdSchema,
  sensortype_id: MongoObjectIdSchema,
  name: Joi.string().required(),
  meta: MetaSchema.required(),
  data_source: DataSourceSchema,
  device_id: MongoObjectIdSchema,

});

export const SensorSchemas = {
  _base: SensorBaseSchema,
  _details: SensorDetailsSchema,
  _details_values: SensorDetailsWithValuesSchema,
  
  _get: SensorDetailsWithValuesSchema,

  _create: SensorCreateSchema,

};