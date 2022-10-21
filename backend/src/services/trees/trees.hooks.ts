import { default as feathers, HookContext } from '@feathersjs/feathers';
import validate from 'feathers-validate-joi';
import { Hook } from 'mocha';
import { TreeSchemas } from '../../validation/tree';
import { iff } from 'feathers-hooks-common';

const joiOptions = { convert: true, abortEarly: false };

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [async (context: HookContext) => {
      context.data.id = 'nanoid-id-goes-here';
      return context;
    }],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [
      // Only run output validation if setting is set to true
      iff(
        (context: HookContext) => context.app.get('validate_output'),
        validate.form(TreeSchemas._get, joiOptions)
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
