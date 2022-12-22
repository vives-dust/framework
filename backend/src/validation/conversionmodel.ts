import Joi from 'joi';
import { NanoIdSchema } from './partials/nano_id';
import { MongoObjectIdSchema } from './partials/mongo_object_id';
import { ConversionSampleSchema } from './partials/conversion_sample';
import { UnitSchema } from './partials/unit';

// Management Schema's

const ConversionModelBaseSchema = Joi.object().keys({
  id: NanoIdSchema.required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  input_unit: UnitSchema.required(),
  output_unit: UnitSchema.required(),
})

const ConversionModelCreateSchema = ConversionModelBaseSchema.keys({
  samples: Joi.array().min(1).items(ConversionSampleSchema).required(),
});


  
export const ConversionModelSchemas = {

  _create: ConversionModelCreateSchema,
  _sanitize: ConversionModelBaseSchema
};