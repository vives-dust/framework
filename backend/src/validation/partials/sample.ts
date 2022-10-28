import Joi from 'joi';

const SampleSchema = Joi.alternatives().try(
  Joi.object().keys({
    time: Joi.date().required(),
    value: Joi.number().required()
  }),
  Joi.object()
);

export { SampleSchema }