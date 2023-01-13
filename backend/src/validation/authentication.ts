import Joi from 'joi';

import { LocalStrategySchema, JwtStrategySchema } from './partials/auth_strategy';
import { PayloadSchema, TokenSchema } from './partials/jwt';
import { UserSchemas } from './user';

const AuthenticationRequestBaseSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
  strategy: LocalStrategySchema.required(),
});

const AuthenticationTokenGrantedSchema = Joi.object().keys({
  accessToken: TokenSchema.required(),
  authentication: Joi.object().keys({
    strategy: Joi.alternatives().try(LocalStrategySchema, JwtStrategySchema).required(),
    accessToken: TokenSchema.required(),
    payload: PayloadSchema.required(),
  }).required(),
  user: UserSchemas._get.required(),
});


export const AuthenticationSchemas = {

  _create: AuthenticationRequestBaseSchema,           // User input
  _created: AuthenticationTokenGrantedSchema,         // Output result

  _removed: AuthenticationTokenGrantedSchema,         // Output result
};