// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import * as AuthenticationMiddleware from './authentication.middleware';
import * as Validation from '../../hooks/validation';
import { iffElse, isProvider } from 'feathers-hooks-common';
import { AuthenticationSchemas } from '../../validation/authentication';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          // Called when requesting JWT token
          Validation.input(AuthenticationSchemas._create),
          AuthenticationMiddleware.force_mongo_id_usage,
        ],
        [ /* hooks for internal requests */ ]
      ),
    ],
    update: [],     // Disabled out-of-the-box
    patch: [],      // Disabled out-of-the-box

    // A bit weird but the DELETE method does nothing except for validating the JWT token.
    // If valid, it returns same as create.
    remove: [
      // Can't seem to disallow any body to be send with the request,
      // however that does not seem a problem as feathers ignores it anyway
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          AuthenticationMiddleware.sanitize_authentication_reply,
          Validation.dispatch(AuthenticationSchemas._created)
        ],
        [ /* hooks for internal requests */ ]
      ),
    ],
    update: [],
    patch: [],
    remove: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          AuthenticationMiddleware.sanitize_authentication_reply,
          Validation.dispatch(AuthenticationSchemas._removed)
        ],
        [ /* hooks for internal requests */ ]
      ),
    ]
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
