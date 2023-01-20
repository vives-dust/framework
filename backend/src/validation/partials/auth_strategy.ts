import Joi from 'joi';

const LocalStrategySchema = Joi.string().valid('local');
const JwtStrategySchema = Joi.string().valid('jwt');

export { LocalStrategySchema, JwtStrategySchema };
