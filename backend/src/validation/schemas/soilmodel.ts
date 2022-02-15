import Joi from 'joi';

// See interface SoilModelMoistureSample soilmodels/soilmodels.class.ts
const SoilModelMoistureSampleSchema = Joi.object().keys({
  raw: Joi.number().min(0).max(65535).required(),
  moisture: Joi.number().min(0).max(100).required()
});

// See interface SoilModelData soilmodels/soilmodels.class.ts
const SoilModelDataSchema = Joi.object().keys({
  name: Joi.string().required(),
  samples: Joi.array().items(SoilModelMoistureSampleSchema)
});

export const SoilModelSchemas = {

  create: SoilModelDataSchema,
  update: SoilModelDataSchema

};