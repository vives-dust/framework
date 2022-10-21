import Joi from 'joi';

const LocationSchema = Joi.object().keys({
  longitude: Joi.number().min(-90).max(90).required(),
  latitude: Joi.number().min(-180).max(180).required(),
  height: Joi.number()
});

export { LocationSchema }