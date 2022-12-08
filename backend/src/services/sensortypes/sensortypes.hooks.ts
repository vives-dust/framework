import { HooksObject } from '@feathersjs/feathers';
import { SensorTypeSchemas } from '../../validation/sensor_type';
import * as Validation from '../../hooks/validation';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ Validation.input(SensorTypeSchemas._create) ],
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
