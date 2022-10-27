import { default as feathers, HookContext } from '@feathersjs/feathers';
import validate from 'feathers-validate-joi';
import { Hook } from 'mocha';
import { SensorSchemas } from '../../validation/sensor';
import { iff } from 'feathers-hooks-common';
import * as SensorMiddleware from './sensors.middleware'
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
    get: [
      SensorMiddleware.pre_populate_relations
    ],
    create: [generate_nanoid],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [
      SensorMiddleware.populate_last_value,
      // TODO: populate values ?
      SensorMiddleware.sanitize_single_sensor,
      // Only run output validation if setting is set to true
      iff(
        (context: HookContext) => context.app.get('validate_output'),
        validate.form(SensorSchemas._get, joiOutputDispatchOptions)
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
