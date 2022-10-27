import { default as feathers, HookContext } from '@feathersjs/feathers';
import { SensorSchemas } from '../../validation/sensor';
import { iffElse, isProvider } from 'feathers-hooks-common';
import * as SensorMiddleware from './sensors.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import * as Validation from '../../hooks/validation';

// const dispatch = (message: string) => {
//   return (context : HookContext) => { return debug(message)(context); };
// };

export default {
  before: {
    all: [],
    find: [],
    get: [
      // SensorMiddleware.pre_populate_relations
      // dispatch('Very nice')
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */ ],
        [ /* hooks for internal requests */ ],
      ),
    ],
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
    get: [
      // SensorMiddleware.populate_last_value,
      // // TODO: populate values ?
      // SensorMiddleware.sanitize_single_sensor,
      // // Only run output validation if setting is set to true

      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          Validation.dispatch(SensorSchemas._get)
        ],
        [ /* hooks for internal requests */],
      ),
    ],
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
