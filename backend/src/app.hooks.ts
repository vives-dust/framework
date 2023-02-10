// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { disallow, iff } from 'feathers-hooks-common';
import { require_admin } from './hooks/authorization';
import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;


export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iff(
        context => !(
          context.path === 'authentication'      // Get auth token
          || context.path === 'users'            // Register user
        ),
        authenticate('jwt'),
        ...require_admin,
      ),
    ],
    update: [ disallow('external') ],
    patch: [ disallow('external') ],
    remove: [ disallow('external') ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
