import { hooks as schemaHooks } from '@feathersjs/schema'
import { disallow } from 'feathers-hooks-common';

import {
  measurementQueryValidator,
  measurementResolver,
  measurementExternalResolver,
  measurementQueryResolver
} from './measurements.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(measurementExternalResolver),
      schemaHooks.resolveResult(measurementResolver)
    ]
  },
  before: {
    all: [
      disallow('external'),
      schemaHooks.validateQuery(measurementQueryValidator),
      schemaHooks.resolveQuery(measurementQueryResolver)
    ],
    find: [],
  },
  after: {
    all: []
  },
  error: {
    all: []
  }
};
