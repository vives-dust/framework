import { default as feathers, HookContext } from '@feathersjs/feathers';
import { TreeSchemas } from '../../validation/tree';
import * as TreeMiddleware from './trees.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import { iffElse, isProvider } from 'feathers-hooks-common';
import * as Validation from '../../hooks/validation';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      generate_nanoid
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      TreeMiddleware.sanitize_tree_listing,

      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          Validation.dispatch(TreeSchemas._find)
        ],
        [ /* hooks for internal requests */],
      ),
    ],
    get: [
      TreeMiddleware.populate_devices,
      TreeMiddleware.populate_sensors,
      TreeMiddleware.sanitize_single_tree,
      
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          Validation.dispatch(TreeSchemas._get)
        ],
        [ /* hooks for internal requests */],
      ),
    ],
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
