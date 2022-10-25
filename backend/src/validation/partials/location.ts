import Joi from 'joi';

const LocationSchema = Joi.object().keys({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

export { LocationSchema }