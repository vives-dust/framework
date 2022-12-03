import Joi from 'joi';

// Check the nanoid length
const NanoidSchema = Joi.string().length(21);

export { NanoidSchema };