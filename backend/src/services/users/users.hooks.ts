import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { iffElse, isProvider } from 'feathers-hooks-common';
import { generate_nanoid } from '../../hooks/nanoid';
import * as Validation from '../../hooks/validation';
import * as UsersMiddleware from './users.middleware'
import { UserSchemas } from '../../validation/user';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [ 
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          hashPassword('password'),
          Validation.input(UserSchemas._create),
          generate_nanoid,
        ],
        [ /* hooks for internal requests */ ],
      )
    ],
    update: [ hashPassword('password'),  authenticate('jwt') ],
    patch: [ hashPassword('password'),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          UsersMiddleware.sanitize_create_user,
          Validation.dispatch(UserSchemas._details)
        ],
        [ /* hooks for internal requests */ ],
      )
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
