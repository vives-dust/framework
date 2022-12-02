import Joi from 'joi';
import { NanoidSchema } from './nanoid';

const MetaPatternSchema = Joi.object().keys({
    depth: Joi.number().less(0).negative(),
    conversion_model_id: NanoidSchema
}).allow({})

export { MetaPatternSchema }