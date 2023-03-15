// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'

import { configurationValidator } from './configuration'
import type { Application, HookContext } from './declarations'
import { logError } from './hooks/log-error'
import { mongodb } from './mongodb'
import { authentication } from './authentication'
import { services } from './services/index'
import { channels } from './channels'
import { authenticate } from '@feathersjs/authentication'
import { require_admin } from './hooks/authorization'
import { disallow, iff } from 'feathers-hooks-common'

const app: Application = koa(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(channels)
app.configure(mongodb)
app.configure(authentication)
app.configure(services)

// Register hooks that run on all service methods
app.hooks({
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
        context => (context.path === 'users'),
        authenticate('jwt'),
      ).else(
        disallow('external')
      ),
    ],
    remove: [ disallow('external') ]
  },
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }