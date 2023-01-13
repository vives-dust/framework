import { DeviceSensorSchemas } from '../../validation/device_sensor';
import * as Validation from '../../hooks/validation';
import { require_admin } from '../../hooks/authorization';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      ...require_admin,
      Validation.input(DeviceSensorSchemas._create)
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
