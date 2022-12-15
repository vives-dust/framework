import Joi from 'joi';

const MongoObjectIdSchema = Joi.string().length(24).pattern(new RegExp('^[a-z0-9]*$'));

export { MongoObjectIdSchema };