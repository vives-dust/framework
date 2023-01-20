import Joi from 'joi';

import { NanoIdSchema } from './partials/nano_id';
import { PermissionsSchema } from './partials/permissions';

// Public API Schema's

const UserBaseSchema = Joi.object().keys({
  id: NanoIdSchema.required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
});

const UserCreateSchema = UserBaseSchema.keys({
  password: Joi.string().required(),
});

const UserDetailsSchema = UserBaseSchema.keys({
  permissions: PermissionsSchema.required(),
});

const UserPatchSchema = Joi.object().keys({
  id: NanoIdSchema,
  name: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
});

const UserPatchWithPermissionsSchema = UserPatchSchema.keys({
  permissions: PermissionsSchema,
});

// Management Schema's


export const UserSchemas = {

  _base: UserBaseSchema,

  _get: UserDetailsSchema,

  _create: UserCreateSchema,            // User input
  _created: UserDetailsSchema,          // Output result

  _patch: UserPatchSchema,
  _patched: UserDetailsSchema,

  _patch_with_permissions: UserPatchWithPermissionsSchema,     // Allowed by admin
};