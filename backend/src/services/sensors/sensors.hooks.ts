import { HooksObject } from '@feathersjs/feathers';
import { disallow } from 'feathers-hooks-common';
import validate from 'feathers-validate-joi';
import { SensorSchemas } from '../../validation/schemas/sensor';

const joiOptions = { convert: true, abortEarly: false };

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ disallow('external'), validate.form(SensorSchemas.create, joiOptions) ],
    update: [ disallow() ],
    patch: [ disallow() ],
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
