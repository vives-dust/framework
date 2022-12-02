import Joi from 'joi';

const ObjectIdSchema = Joi.string().length(24).pattern(new RegExp('^[a-z0-9]*$'))

export { ObjectIdSchema }