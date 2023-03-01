import { SensorSchemas } from '../../validation/sensor';
import { disallow, fastJoin, iff, isProvider } from 'feathers-hooks-common';
import * as SensorMiddleware from './sensors.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import * as Validation from '../../hooks/validation';
import { set_resource_url } from '../../hooks/resource_url';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      disallow('external'),
      generate_nanoid,
      Validation.input(SensorSchemas._create),
    ],
    update: [ disallow('external') ],
    patch: [ disallow('external') ],
    remove: [ disallow('external') ]
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
      iff(isProvider('external'),
        fastJoin(SensorMiddleware.sensor_resolvers, { device_and_tree: { tree: true } , sensor_type: true }),   // TODO - Move to middleware
        SensorMiddleware.populate_values,
        SensorMiddleware.sanitize_get_sensor,
        Validation.dispatch(SensorSchemas._get),
      ),
    ],
    create: [
      // TODO - Validate outgoing data
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
