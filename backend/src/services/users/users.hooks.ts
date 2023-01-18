import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { UserSchemas } from '../../validation/user';
import * as UserMiddleware from './users.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import { disallow, iffElse, isProvider, debug, iff } from 'feathers-hooks-common';
import * as Validation from '../../hooks/validation';
import { if_admin_else, require_admin } from '../../hooks/authorization';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [ debug('Hitting USERS') ],
    find: [
      authenticate('jwt'),
      ...require_admin,      // Throws error if not. Do note that find(byemail) for auth seems to skip this.
    ],
    get: [
      authenticate('jwt'),
      UserMiddleware.protect_user_details,      // Only admin can access other user's details
    ],
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
    update: [ disallow('external') ],       // We don't support PUT (replacing entity)
    patch: [
      authenticate('jwt'),
      UserMiddleware.protect_user_details,      // Only admin can access other user's details
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          if_admin_else([
            Validation.input(UserSchemas._patch_with_permissions)
          ], [
            Validation.input(UserSchemas._patch)
          ])
        ],
        [ /* hooks for internal requests */ ]
      ),
    ],
    remove: [
      authenticate('jwt'),
      ...require_admin
    ]
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
    patch: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          UserMiddleware.sanitize_user_details,
          Validation.dispatch(UserSchemas._patched)
        ],
        [ /* hooks for internal requests */ ]
      ),
    ],
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
