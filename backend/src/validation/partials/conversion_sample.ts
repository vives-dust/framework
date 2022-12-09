import Joi from 'joi';

const ConversionSampleSchema = Joi.object().keys({
  input_value: Joi.number().required(),
  output_value: Joi.number().required()
});

export { ConversionSampleSchema };