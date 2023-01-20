import Joi from 'joi';

import { NanoIdSchema } from './nano_id';

// TODO: Probable could use some stricter validation
const PayloadSchema = Joi.object().keys({
  iat: Joi.number().required(),
  exp: Joi.number().required(),
  aud: Joi.string().uri().required(),
  iss: Joi.string().valid('feathers'),
  sub: NanoIdSchema.required(),
  jti: Joi.string().required(),
});

const TokenSchema = Joi.string();

export { PayloadSchema, TokenSchema };