import { TreeSchemas } from '../../validation/tree';
import * as TreeMiddleware from './trees.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import { fastJoin, iff, isProvider } from 'feathers-hooks-common';
import * as Validation from '../../hooks/validation';
import { set_resource_url } from '../../hooks/resource_url';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iff(isProvider('external'),
        generate_nanoid, 
        Validation.input(TreeSchemas._create),
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
      iff(isProvider('external'),
        TreeMiddleware.sanitize_find_trees,
        Validation.dispatch(TreeSchemas._find),
      ),
    ],
    get: [
      set_resource_url,
      iff(isProvider('external'),
        // 2x fastJoin because sensors depends on id's of devices and
        // we do not want nested objects (which we would get with single fastJoin)
        fastJoin(TreeMiddleware.tree_resolvers, { devices: true }),       // TODO - Refactor to middleware
        fastJoin(TreeMiddleware.tree_resolvers, { sensors_and_their_types: { types: true, device: true } }),       // TODO - Refactor to middleware
        TreeMiddleware.sanitize_get_tree,
        Validation.dispatch(TreeSchemas._get),
      ),
    ],
    create: [
      iff(isProvider('external'),
        TreeMiddleware.sanitize_created_tree,
        Validation.dispatch(TreeSchemas._created),
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
