import { default as feathers, HookContext } from '@feathersjs/feathers';
import { TreeSchemas } from '../../validation/tree';
import * as TreeMiddleware from './trees.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import { debug, fastJoin, iffElse, isProvider } from 'feathers-hooks-common';
import * as Validation from '../../hooks/validation';
import { set_resource_url } from '../../hooks/resource_url';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iffElse(isProvider('external'),
        [/* hooks for external requests (rest/socketio/...) */
          generate_nanoid, 
          Validation.input(TreeSchemas._create),
        ],
        [/* hooks for internal requests */
        ]
      ),
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
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          // 2x fastJoin because sensors depends on id's of devices and
          // we do not want nested objects (which we would get with single fastJoin)
          fastJoin(TreeMiddleware.tree_resolvers, { devices: true }),
          fastJoin(TreeMiddleware.tree_resolvers, { sensors_and_their_types: { types: true, device: true } }),
          TreeMiddleware.sanitize_get_tree,
          Validation.dispatch(TreeSchemas._get)
        ],
        [ /* hooks for internal requests */ ],
      ),
    ],
    create: [
      iffElse(isProvider('external'),
        [/* hooks for external requests (rest/socketio/...) */
          TreeMiddleware.sanaitize_create_tree,
          Validation.dispatch(TreeSchemas._create)
        ],
        [/* hooks for internal requests */
        ]
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
