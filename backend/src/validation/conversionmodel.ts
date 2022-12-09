import Joi from 'joi';

const ConversionSampleSchema = Joi.object().keys({
  input_value: Joi.number().required(),
  output_value: Joi.number().required()
});

const ConversionModelSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  input_unit: Joi.string().required(),
  output_unit: Joi.string().required(),
  samples: Joi.array().min(1).items(ConversionSampleSchema).required()
});

export const ConversionModelSchemas = {
  create: ConversionModelSchema
};