import Joi from 'joi';

const ImageSchema = Joi.object().keys({
    image_url: Joi.string().allow('').uri().required()          // TODO: Do we need to require image ?
});

export { ImageSchema }