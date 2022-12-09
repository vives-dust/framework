import Joi from 'joi';

const MeasurementSampleSchema = Joi.alternatives().try(
  // Allow object with time/value
  Joi.object().keys({
    time: Joi.date().required(),
    value: Joi.number().required()
  }),
  // Allow empty object
  Joi.object(),
);

export { MeasurementSampleSchema };