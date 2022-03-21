import Joi from 'joi';
import { SensorSchema } from './sensor';

// See interface Device devices/device.class.ts
const DeviceSchema = Joi.object().keys({
  name: Joi.string().required(),
  hardwareId: Joi.string().required(),
  description: Joi.string(),
  location: Joi.object().keys({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    height: Joi.number()
  }).required(),
  soilModelId: Joi.string(),
  sensors: Joi.array().min(1).items(SensorSchema).required()
});

export const DeviceSchemas = {
  create: DeviceSchema
};