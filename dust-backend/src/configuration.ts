import { Type, getValidator, defaultAppConfiguration } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { dataValidator } from './validators'

export const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Object({
    host: Type.String(),
    port: Type.Number(),
    public: Type.String()
  }),
  Type.Object({
    mongodb_custom: Type.Object({
      host: Type.String(),
      port: Type.Union([Type.String(), Type.Number()]),
      database: Type.String(),
      root_username: Type.String(),
      root_password: Type.String(),
    })
  }),
  Type.Object({
    application: Type.Object({
      domain: Type.String(),
    }),
  }),
])

export type ApplicationConfiguration = Static<typeof configurationSchema>

export const configurationValidator = getValidator(configurationSchema, dataValidator)
