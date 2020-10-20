import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const addUserId = async (context :HookContext) :Promise<HookContext> => {
  if( context.params.user._id ) {
    context.data.userId = context.params.user._id;
  }
  return context;
};

const addCreatedAtDate = async (context :HookContext) :Promise<HookContext> => {
  context.data.createdAt = new Date();
  return context;
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ addUserId, addCreatedAtDate ],
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
