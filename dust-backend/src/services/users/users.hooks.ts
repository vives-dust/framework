import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import { disallow } from 'feathers-hooks-common';
import { inject_nano_id } from '../../hooks/inject-nanoid';

import {
  userDataValidator,
  userPatchValidator,
  userQueryValidator,
  userResolver,
  userExternalResolver,
  userDataResolver,
  userPatchResolver,
  userQueryResolver
} from './users.schema'

export default {
  around: {
    all: [schemaHooks.resolveExternal(userExternalResolver), schemaHooks.resolveResult(userResolver)],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },
  before: {
    all: [schemaHooks.validateQuery(userQueryValidator), schemaHooks.resolveQuery(userQueryResolver)],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(userDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(userDataResolver),
    ],
    patch: [
      schemaHooks.validateData(userPatchValidator),
      schemaHooks.resolveData(userPatchResolver)
    ],
    remove: [disallow()]      // Users cannot be deleted
  },
  after: {
    all: []
  },
  error: {
    all: []
  }
};
