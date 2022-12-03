import Joi from 'joi';
import { NanoidSchema } from './partials/nanoid';
import { MongoObjectIdSchema } from './partials/mongo_object_id';
import { SampleSchema } from './partials/sample';
import { UnitSchema } from './partials/unit';

const ConversionModelCreateSchema = Joi.object().keys({
  _id: MongoObjectIdSchema,
  id: NanoidSchema.required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  input_unit: UnitSchema.required(),
  output_unit: UnitSchema.required(),
  samples: Joi.array().min(1).items(SampleSchema).required(),
});
  
export const ConversionModelSchemas = {

  _create: ConversionModelCreateSchema,

};