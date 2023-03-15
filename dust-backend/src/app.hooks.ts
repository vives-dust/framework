import { logError } from './hooks/log-error'
import type { HookContext } from './declarations'
import { authenticate } from '@feathersjs/authentication'
import { require_admin } from './hooks/authorization'
import { disallow, iff } from 'feathers-hooks-common'

export const hooks = {
  around: {
    all: [logError]
  },
  before: {
    create: [
      iff(       // If not authenticating or registering user, require admin
        (context : HookContext) => !(
          context.path === 'authentication'      // Get auth token
          || context.path === 'users'            // Register user
        ),
        ...[
          authenticate('jwt'),
          require_admin,
        ]
      ),
    ],
    update: [ disallow('external') ],
    patch: [
      iff(  // For the moment we only allow user details to be patched
        (context : HookContext) => (context.path === 'users'),
        authenticate('jwt'),
      ).else(
        disallow('external')
      ),
    ],
    remove: [ disallow('external') ]
  },
  after: {},
  error: {}
};

export const setupTeardownHooks = {
  setup: [],
  teardown: []
}