import { HookContext } from '@feathersjs/feathers';
import { disallow } from 'feathers-hooks-common';
import validate from 'feathers-validate-joi';
import { MeasurementSchemas } from '../../validation/measurement';

const joiOptions = {
  convert: true,
  abortEarly: false,
  // Set validation content to query params
  getContext(context : HookContext) {
    return context.params.query;
  },
  setContext(context : HookContext, newValues : any) {
    Object.assign(context.params.query, newValues);
  },
};

export default {
  before: {
    all: [],
    find: [ disallow('external'), validate.form(MeasurementSchemas.find, joiOptions) ],
    get: [ disallow() ],
    create: [ disallow() ],
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
