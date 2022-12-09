import { default as feathers, HookContext } from '@feathersjs/feathers';
import { generate_nanoid } from '../../hooks/nanoid';
import * as DevicesMiddleware from './devices.middleware';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ generate_nanoid, DevicesMiddleware.create_device],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ DevicesMiddleware.create_sensors ],
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
