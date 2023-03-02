import { DeviceSensorSchemas } from '../../validation/device_sensor';
import * as Validation from '../../hooks/validation';
import * as DeviceSensorsMiddleware from './devicesensors.middleware';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      Validation.input(DeviceSensorSchemas._create),
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      DeviceSensorsMiddleware.join_devicesensor_with_sensor_type,
    ],
    get: [
      DeviceSensorsMiddleware.join_devicesensor_with_sensor_type,
    ],
    create: [
      // TODO - Validate output !
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
