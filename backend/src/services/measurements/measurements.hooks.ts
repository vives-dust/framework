import * as authentication from '@feathersjs/authentication';
import { NotAuthenticated } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { disallow } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const checkApiKey = async (context: HookContext) => {
  const { params } = context;
  if(params && params.headers && params.headers['api-key'] !== 'xyz') {
    throw new NotAuthenticated();
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getId = async (context: HookContext) => {

  const Sensors = context.app.service('sensors');
  const sensor = await Sensors.find( { query: {deviceId: 'sensor-001'} });
  context.data.id = sensor.data[0]._id;
  return context;
};

export default {
  before: {
    all: [],
    find: [disallow()],
    get: [ authenticate('jwt')],
    create: [ checkApiKey, getId ],
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
