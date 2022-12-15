import Joi from 'joi';
import { NanoIdSchema } from './partials/nano_id';
import { MongoObjectIdSchema } from './partials/mongo_object_id';
import { ConversionSampleSchema } from './partials/conversion_sample';
import { UnitSchema } from './partials/unit';

// Management Schema's

const ConversionModelCreateSchema = Joi.object().keys({
  _id: MongoObjectIdSchema,
  id: NanoIdSchema.required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  input_unit: UnitSchema.required(),
  output_unit: UnitSchema.required(),
  samples: Joi.array().min(1).items(ConversionSampleSchema).required(),
});
  
export const ConversionModelSchemas = {

  _create: ConversionModelCreateSchema,

};