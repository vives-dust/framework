import Joi from 'joi';

const SoilModelSampleSchema = Joi.object().keys({
  raw: Joi.number().min(0).max(65535).required(),
  moisture: Joi.number().min(0).max(100).required()
});

const SoilModelSchema = Joi.object().keys({
  name: Joi.string().required(),
  samples: Joi.array().min(2).items(SoilModelSampleSchema).required()
});

export const SoilModelSchemas = {

  create: SoilModelSchema

};