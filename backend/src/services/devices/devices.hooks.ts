import { disallow, iff, isProvider } from 'feathers-hooks-common';
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
      iff(isProvider('external'),
        Validation.input(DeviceSchemas._create),
        DevicesMiddleware.join_tree_with_device_by_nanoid,
        DevicesMiddleware.join_devicetype_with_device,
        DevicesMiddleware.build_device,
        generate_nanoid,
      ),
    ],
    update: [ disallow('external') ],
    patch: [ disallow('external') ],
    remove: [ disallow('external') ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      iff(isProvider('external'),
        DevicesMiddleware.create_sensors_for_device,
        DevicesMiddleware.join_tree_with_device_by_mongoid,
        DevicesMiddleware.join_devicetype_with_device_by_typeid,
        DevicesMiddleware.sanitize_create_device,
        Validation.dispatch(DeviceSchemas._created),
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
