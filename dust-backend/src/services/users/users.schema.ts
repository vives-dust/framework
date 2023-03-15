// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, StringEnum } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'
import { NanoIdSchema } from '../../typebox-types/nano_id'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const userSchema = Type.Object(
  {
    _id: NanoIdSchema,
    email: Type.String({ format: 'email' }),
    password: Type.String(),
    name: Type.String(),
    // TODO - Later we should replace role with permissions like can:create, can:update, ....
    role: StringEnum(['user', 'admin']),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'User', additionalProperties: false }
)
export type User = Static<typeof userSchema>
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve<User, HookContext>({})

export const userExternalResolver = resolve<User, HookContext>({
  // The password should never be visible externally
  password: async () => undefined
})

// Schema for creating new entries
export const userDataSchema = Type.Pick(userSchema, ['email', 'password', 'name'], {
  $id: 'UserData'
})
export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<User, HookContext>({
  // TODO - Can we generate nano id here? Can't seem to get it to work
  password: passwordHash({ strategy: 'local' }),
  createdAt: async () => (new Date()).toISOString(),
  updatedAt: async () => (new Date()).toISOString(),
  role: async () => 'user',
})

// Schema for updating existing entries
export const userPatchSchema = Type.Partial(Type.Omit(userSchema, ['createdAt', 'updatedAt']), {
  $id: 'UserPatch'
})
export type UserPatch = Static<typeof userPatchSchema>
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve<User, HookContext>({
  password: passwordHash({ strategy: 'local' }),
  updatedAt: async () => (new Date()).toISOString(),
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['_id', 'email'])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  _id: async (value, user, context) => {
    if (context.params.user) {
      return context.params.user._id
    }

    return value
  }
})
