// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { disallow } from "feathers-hooks-common";

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ disallow('external') ],
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
