import { default as feathers, HookContext } from '@feathersjs/feathers';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [async (context: HookContext) => {
      context.data.id = 'nanoid-id-goes-here';
      return context;
    }],
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
