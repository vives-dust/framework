import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  treeDataValidator,
  treePatchValidator,
  treeQueryValidator,
  treeResolver,
  treeExternalResolver,
  treeDataResolver,
  treePatchResolver,
  treeQueryResolver
} from './trees.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(treeExternalResolver),
      schemaHooks.resolveResult(treeResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(treeQueryValidator),
      schemaHooks.resolveQuery(treeQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(treeDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(treeDataResolver)
    ],
    patch: [
      schemaHooks.validateData(treePatchValidator),
      schemaHooks.resolveData(treePatchResolver)
    ],
    remove: []
  },
  after: {
    all: []
  },
  error: {
    all: []
  }
};
