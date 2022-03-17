import { HooksObject } from '@feathersjs/feathers';
import { disallow } from 'feathers-hooks-common';
import validate from 'feathers-validate-joi';
import { DeviceSchemas } from '../../validation/schemas/device';

const joiOptions = { convert: true, abortEarly: false };

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ validate.form(DeviceSchemas.create, joiOptions) ],
    update: [],
    patch: [],
    remove: [ disallow() ]
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
