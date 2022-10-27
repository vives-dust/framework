import { default as feathers, HookContext } from '@feathersjs/feathers';
import validate from 'feathers-validate-joi';
import { TreeSchemas } from '../../validation/tree';
import { iff } from 'feathers-hooks-common';
import * as TreeMiddleware from './trees.middleware';
import { generate_nanoid } from '../../hooks/nanoid';

const joiOutputDispatchOptions = {
  convert: true,
  abortEarly: false,
  getContext(context : HookContext) {
    return context.dispatch;
  },
  setContext(context : HookContext, newValues : any) {
    Object.assign(context.dispatch, newValues);
  },
};

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
      // Only run output validation if setting is set to true
      iff(
        (context: HookContext) => context.app.get('validate_output'),
        validate.form(TreeSchemas._find, joiOutputDispatchOptions)
      )
    ],
    get: [
      TreeMiddleware.populate_devices,
      TreeMiddleware.populate_sensors,
      TreeMiddleware.sanitize_single_tree,
      // Only run output validation if setting is set to true
      iff(
        (context: HookContext) => context.app.get('validate_output'),
        validate.form(TreeSchemas._get, joiOutputDispatchOptions)
      )
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
