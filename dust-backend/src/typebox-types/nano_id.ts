import { Type } from '@feathersjs/typebox'

export const NanoIdSchema = Type.RegEx(/^[a-zA-Z0-9_-]{21}$/);
