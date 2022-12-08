import Joi from 'joi';

const SampleSchema = Joi.object().keys({
    raw: Joi.number().required(),
    value: Joi.number().required()
  });

export { SampleSchema };