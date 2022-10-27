import { default as feathers, HookContext } from '@feathersjs/feathers';
import { TreeSchemas } from '../../validation/tree';
import * as TreeMiddleware from './trees.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import { iffElse, isProvider } from 'feathers-hooks-common';
import * as Validation from '../../hooks/validation';
import { set_resource_url } from '../../hooks/resource_url';

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
      set_resource_url,
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          TreeMiddleware.sanitize_find_trees,
          Validation.dispatch(TreeSchemas._find)
        ],
        [ /* hooks for internal requests */ ],
      ),
    ],
    get: [
      set_resource_url,
      // TreeMiddleware.populate_devices,
      // TreeMiddleware.populate_sensors,
      // TreeMiddleware.sanitize_single_tree,
      
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          Validation.dispatch(TreeSchemas._get)
        ],
        [ /* hooks for internal requests */ ],
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
