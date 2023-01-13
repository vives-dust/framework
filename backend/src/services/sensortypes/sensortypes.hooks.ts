import { SensorTypeSchemas } from '../../validation/sensor_type';
import * as Validation from '../../hooks/validation';
import { require_admin } from '../../hooks/authorization';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      ...require_admin,
      Validation.input(SensorTypeSchemas._create)
    ],
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
