import { default as feathers, HookContext } from '@feathersjs/feathers';
import { SensorSchemas } from '../../validation/sensor';
import { debug, fastJoin, iff, iffElse, isProvider } from 'feathers-hooks-common';
import * as SensorMiddleware from './sensors.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import * as Validation from '../../hooks/validation';
import { set_resource_url } from '../../hooks/resource_url';

// const dispatch = (message: string) => {
//   return (context : HookContext) => { return debug(message)(context); };
// };

export default {
  before: {
    all: [],
    find: [],
    get: [
      // dispatch('Very nice')
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */ ],
        [ /* hooks for internal requests */ ],
      ),
    ],
    create: [ generate_nanoid, Validation.input(SensorSchemas._create) ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      set_resource_url,
      SensorMiddleware.populate_last_value,
    ],
    get: [
      set_resource_url,
      SensorMiddleware.populate_last_value,
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          fastJoin(SensorMiddleware.sensor_resolvers, { device_and_tree: { tree: true } , sensor_type: true }),
          SensorMiddleware.populate_values,

          // Only convert values if conversion model id is present
          iff(
            (context : HookContext) => context.result.meta.conversion_model_id,
            fastJoin(SensorMiddleware.sensor_resolvers, { conversion_model: true }),
            SensorMiddleware.convert_values,
          ),
          
          SensorMiddleware.sanitize_get_sensor,
          Validation.dispatch(SensorSchemas._get)
        ],
        [ /* hooks for internal requests */ ],
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
