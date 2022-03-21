import Joi from 'joi';

// See interface Sensor sensors/sensor.class.ts
export const SensorSchema = Joi.object().keys({
  type: Joi.string().valid('temperature', 'moisture').required(),
  deviceId: Joi.string(),
  field: Joi.string().required(),

  depth: Joi.when('type', { is: 'moisture', then: Joi.number().required(), otherwise: Joi.forbidden() }),
});

export const SensorsSchema = Joi.array().items(SensorSchema);

export const SensorSchemas = {
  create: SensorsSchema,
};