import Joi from 'joi';

const ConversionModelSampleSchema = Joi.object().keys({
  raw: Joi.number().min(0).max(65535).required(),
  moisture: Joi.number().min(0).max(100).required()
});

const ConversionModelSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  input_unit: Joi.string().required(),
  output_unit: Joi.string().required(),
  samples: Joi.object().keys({
    type: Joi.array().min(1).items(ConversionModelSampleSchema).required()
  }),
});

export const ConversionModelSchemas = {
  create: ConversionModelSchema
};