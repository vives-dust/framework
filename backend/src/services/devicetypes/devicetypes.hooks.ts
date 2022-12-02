import { HooksObject } from '@feathersjs/feathers';
import { DeviceTypeSchemas } from '../../validation/device_type';
import * as Validation from '../../hooks/validation';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ Validation.input(DeviceTypeSchemas._create) ],
    update: [],
    patch: [],
    remove: []
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
