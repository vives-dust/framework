import Joi from 'joi';

const ImageUrlSchema = Joi.string().uri().required();

export { ImageUrlSchema };