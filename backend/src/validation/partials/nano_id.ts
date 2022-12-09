import Joi from 'joi';

// Check the nanoid length
const NanoIdSchema = Joi.string().length(21);

export { NanoIdSchema };