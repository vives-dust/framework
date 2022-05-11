import Joi from 'joi';

const DeviceSchema = Joi.object().keys({
  name: Joi.string().required(),
  hardwareId: Joi.string().required(),
  description: Joi.string(),
  location: Joi.object().keys({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    height: Joi.number()
  }).required(),
  sensors: Joi.array().min(1).items(
    Joi.object().keys({
      _type: Joi.string().valid('temperature', 'moisture').required(),
      measurementField: Joi.string().required(),
    
      depth: Joi.when('_type', { is: 'moisture', then: Joi.number().required(), otherwise: Joi.forbidden() }),
      soilModelId: Joi.when('_type', { is: 'moisture', then: Joi.string(), otherwise: Joi.forbidden() }),
    })
  ).required()
});

export const DeviceSchemas = {
  create: DeviceSchema
};