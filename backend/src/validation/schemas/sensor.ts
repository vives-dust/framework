import Joi from 'joi';

// See interface Sensor sensors/sensor.class.ts
export const SensorSchema = Joi.object().keys({
  type: Joi.string().valid('temperature', 'moisture').required(),
  deviceId: Joi.string(),
  field: Joi.string().required(),

  depth: Joi.when('type', { is: 'moisture', then: Joi.number().required(), otherwise: Joi.forbidden() }),
});

export const SensorSchemas = {

  create: SensorSchema,

};