import { hooks as schemaHooks } from '@feathersjs/schema'
import { disallow } from 'feathers-hooks-common';

import {
  measurementsQueryValidator,
  measurementsResolver,
  measurementsExternalResolver,
  measurementsQueryResolver
} from './measurements.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(measurementsExternalResolver),
      schemaHooks.resolveResult(measurementsResolver)
    ]
  },
  before: {
    all: [
      disallow('external'),
      schemaHooks.validateQuery(measurementsQueryValidator),
      schemaHooks.resolveQuery(measurementsQueryResolver)
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
