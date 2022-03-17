import Joi from 'joi';

// See interface Sensor sensors/sensor.class.ts
const SensorSchema = Joi.object().keys({
  type: Joi.string().valid('temperature', 'moisture').required(),
  deviceId: Joi.string().required(),
  field: Joi.string().required(),

  depth: Joi.when('type', { is: 'moisture', then: Joi.number().required(), otherwise: Joi.forbidden() }),
});

export const SensorSchemas = {

  create: SensorSchema,

};