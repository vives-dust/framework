import Joi from 'joi';

const NanoidSchema = Joi.string().length(21)

export { NanoidSchema }