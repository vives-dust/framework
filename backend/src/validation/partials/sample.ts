import Joi from 'joi';

const SampleSchema = Joi.object().keys({
  time: Joi.date().timestamp().required(),
  value: Joi.number().required()
});

export { SampleSchema }