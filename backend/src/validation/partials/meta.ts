import Joi from 'joi';

const MetaSchema = Joi.object().keys({
  depth: Joi.number().less(0).negative(),
  conversion_model_name: Joi.string(),
});

export { MetaSchema };