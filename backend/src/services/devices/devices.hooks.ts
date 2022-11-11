import { default as feathers, HookContext } from '@feathersjs/feathers';
import { generate_nanoid } from '../../hooks/nanoid';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      generate_nanoid
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
