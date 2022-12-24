// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import * as AuthenticationMiddleware from './authentication.middleware';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      AuthenticationMiddleware.force_mongo_id_usage,
    ],      // Called when requesting JWT token
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      AuthenticationMiddleware.sanitize_create,
      // TODO: Validate
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
