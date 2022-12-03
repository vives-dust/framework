import Joi from 'joi';

const ResourceUrlSchema = Joi.string().uri();

export { ResourceUrlSchema };