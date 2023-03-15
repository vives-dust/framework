import { hooks as schemaHooks } from '@feathersjs/schema'
import { inject_nano_id } from '../../hooks/inject-nanoid'

import {
  treesDataValidator,
  treesPatchValidator,
  treesQueryValidator,
  treesResolver,
  treesExternalResolver,
  treesDataResolver,
  treesPatchResolver,
  treesQueryResolver
} from './trees.schema'

export default {
  around: {
    all: [
      schemaHooks.resolveExternal(treesExternalResolver),
      schemaHooks.resolveResult(treesResolver)
    ]
  },
  before: {
    all: [
      schemaHooks.validateQuery(treesQueryValidator),
      schemaHooks.resolveQuery(treesQueryResolver)
    ],
    find: [],
    get: [],
    create: [
      schemaHooks.validateData(treesDataValidator),
      inject_nano_id,
      schemaHooks.resolveData(treesDataResolver)
    ],
    patch: [
      schemaHooks.validateData(treesPatchValidator),
      schemaHooks.resolveData(treesPatchResolver)
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
