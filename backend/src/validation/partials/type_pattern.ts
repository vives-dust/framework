import Joi from 'joi';

const TypePatternSchema = Joi.string().pattern(new RegExp('^[a-z0-9,-]*$'))

export { TypePatternSchema }