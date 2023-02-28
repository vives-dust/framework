import Joi from 'joi';

const PermissionsSchema = Joi.array().min(1).items(Joi.string().valid('user', 'admin'));

export { PermissionsSchema };