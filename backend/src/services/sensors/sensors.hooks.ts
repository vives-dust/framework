import { SensorSchemas } from '../../validation/sensor';
import { iff, isProvider } from 'feathers-hooks-common';
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
      SensorMiddleware.join_conversion_model_if_present,
      SensorMiddleware.join_sensor_type,
      SensorMiddleware.convert_values_by_conversion_model,
    ],
    get: [
      set_resource_url,
      SensorMiddleware.populate_last_value,
      iff(isProvider('external'),
        SensorMiddleware.join_device_with_tree,
        SensorMiddleware.join_sensor_type,
        SensorMiddleware.populate_values,
        SensorMiddleware.join_conversion_model_if_present,
        SensorMiddleware.convert_values_by_conversion_model,
        SensorMiddleware.sanitize_get_sensor,
        Validation.dispatch(SensorSchemas._get),
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
