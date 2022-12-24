import Joi from 'joi';

import { NanoIdSchema } from './partials/nano_id';

// Public API Schema's

const UserBaseSchema = Joi.object().keys({
  id: NanoIdSchema.required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
});

const UserCreateSchema = UserBaseSchema.keys({
  password: Joi.string().required(),
});

// Management Schema's


export const UserSchemas = {

  _base: UserBaseSchema,

  _get: UserBaseSchema,

  _create: UserCreateSchema,        // User input
  _created: UserBaseSchema,         // Output result

};