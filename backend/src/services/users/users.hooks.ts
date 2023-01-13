import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { UserSchemas } from '../../validation/user';
import * as UserMiddleware from './users.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import { disallow, iffElse, isProvider } from 'feathers-hooks-common';
import * as Validation from '../../hooks/validation';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [
      hashPassword('password'),
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          generate_nanoid, 
          Validation.input(UserSchemas._create),
        ],
        [ /* hooks for internal requests */ ]
      ),
    ],
    update: [ disallow('external') ],
    patch: [ disallow('external') ],
    remove: [ disallow('external') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],   //TODO: Sanitize and validate
    get: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          UserMiddleware.sanitize_user_details,
          Validation.dispatch(UserSchemas._get)
        ],
        [ /* hooks for internal requests */ ]
      ),
    ],
    create: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          UserMiddleware.sanitize_user_details,
          Validation.dispatch(UserSchemas._created)
        ],
        [ /* hooks for internal requests */ ]
      ),
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
