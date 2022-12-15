import Joi from 'joi';

const ImageUrlSchema = Joi.string().uri();

export { ImageUrlSchema };