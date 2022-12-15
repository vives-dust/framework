import Joi from 'joi';

const PaginationSchema = Joi.object().keys({
  total: Joi.number().required(),
  limit: Joi.number().required(),
  skip: Joi.number().required(),
});

export { PaginationSchema };