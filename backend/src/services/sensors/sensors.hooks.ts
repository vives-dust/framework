import { SensorSchemas } from '../../validation/sensor';
import { fastJoin, iffElse, isProvider } from 'feathers-hooks-common';
import * as SensorMiddleware from './sensors.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import * as Validation from '../../hooks/validation';
import { set_resource_url } from '../../hooks/resource_url';
import { require_admin } from '../../hooks/authorization';

export default {
  before: {
    all: [],
    find: [],
    get: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */ ],
        [ /* hooks for internal requests */ ],
      ),
    ],
    create: [
      ...require_admin,
      generate_nanoid,
      Validation.input(SensorSchemas._create)
    ],
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
