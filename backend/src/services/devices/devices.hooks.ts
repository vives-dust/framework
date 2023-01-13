import { require_admin } from '../../hooks/authorization';
import { generate_nanoid } from '../../hooks/nanoid';
import * as Validation from '../../hooks/validation';
import { DeviceSchemas } from '../../validation/device';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      ...require_admin,
      generate_nanoid,
      Validation.input(DeviceSchemas._create)
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
