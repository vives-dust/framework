import Joi from 'joi';
import { NanoidSchema } from './nanoid';

const MetaPatternSchema = Joi.object().keys({
    depth: Joi.number().less(0).negative(),
    conversionModelId: NanoidSchema
}).allow({})

export { MetaPatternSchema }