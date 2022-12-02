import Joi from 'joi';
import { ObjectIdSchema } from './objectid';

const MetaPatternSchema = Joi.object().keys({
    depth: Joi.number().less(0).negative(),
    conversion_model_id: ObjectIdSchema,
}).allow({})

export { MetaPatternSchema }