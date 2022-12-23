import { default as feathers, HookContext } from '@feathersjs/feathers';
import { debug, fastJoin, iff, iffElse, isProvider } from 'feathers-hooks-common';
import { generate_nanoid } from '../../hooks/nanoid';
import * as DevicesMiddleware from './devices.middleware';
import { DeviceSchemas } from '../../validation/device';
import * as Validation from '../../hooks/validation';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ 
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          Validation.input(DeviceSchemas._base),
          DevicesMiddleware.create_device,
          generate_nanoid,          // inject nanoId last, ObjectId's are fetched first
        ],
        [ /* hooks for internal requests */ ],
      ),
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          DevicesMiddleware.sanitize_create_device,
          Validation.dispatch(DeviceSchemas._create),
          DevicesMiddleware.create_sensors
        ],
        [ /* hooks for internal requests */ ],
      )
    ],
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
