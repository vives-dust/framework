// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import * as AuthenticationMiddleware from './authentication.middleware';
import * as Validation from '../../hooks/validation';
import { iff, isProvider } from 'feathers-hooks-common';
import { AuthenticationSchemas } from '../../validation/authentication';

export default {
  before: {
    all: [],
    find: [],     // Disabled out-of-the-box
    get: [],      // Disabled out-of-the-box
    create: [
      iff(isProvider('external'),
        // Called when requesting JWT token
        Validation.input(AuthenticationSchemas._create),
        AuthenticationMiddleware.force_mongo_id_usage,
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
      iff(isProvider('external'),
        AuthenticationMiddleware.sanitize_authentication_reply,
        Validation.dispatch(AuthenticationSchemas._created),
      ),
    ],
    update: [],
    patch: [],
    remove: [
      iff(isProvider('external'),
        AuthenticationMiddleware.sanitize_authentication_reply,
        Validation.dispatch(AuthenticationSchemas._removed),
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
