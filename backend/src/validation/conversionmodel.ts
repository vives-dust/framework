import Joi from 'joi';
import { NanoidSchema } from './partials/nanoid';
import { ObjectIdSchema } from './partials/objectid';
import { SampleSchema } from './partials/sample';

const ConversionModelCreateSchema = Joi.object().keys({
    _id: ObjectIdSchema,
    id: NanoidSchema.required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    input_unit: Joi.string().allow('').required(),
    output_unit: Joi.string().allow('').required(),
    samples: Joi.array().min(1).items(SampleSchema).required()
  })
  
export const ConversionModelSchemas = {

    _create: ConversionModelCreateSchema,

  };