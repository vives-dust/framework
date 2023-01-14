import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { UserSchemas } from '../../validation/user';
import * as UserMiddleware from './users.middleware';
import { generate_nanoid } from '../../hooks/nanoid';
import { disallow, iffElse, isProvider, debug, iff } from 'feathers-hooks-common';
import * as Validation from '../../hooks/validation';
import { HookContext } from '@feathersjs/feathers';
import { GeneralError } from '@feathersjs/errors';
import checkPermissions from 'feathers-permissions';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [ debug('Hitting the /USERS') ],
    find: [ authenticate('jwt') ],
    get: [
      authenticate('jwt'),
      checkPermissions({
        roles: [ 'admin' ],
        error: false
      }),
      iff((context) => !context.params.permitted,
        (context: HookContext) => {
          console.log('User is not an admin so we need to check rest of info');
          return context;
        },


        (context: HookContext) => {

          console.log('Inside the GET /USERS');
          // console.log(context.params);
          console.log(`Auth User ID: ${context.params.user?.id}`);
          console.log(`Route id: ${context.id}`);
          console.log(`Provider: ${context.params.provider}`);
          console.log(`Authenticated?: ${context.params.authenticated}`);
  
  
          // Check if request is part of authentication process
          if (!context.params.provider && !context.params.user) {
            console.log('This request is part of the auth process.');
            return context;
          }
  
          // In other case ID's need to match !
          const userId = context.params.force_mongo_id ? context.params.user._id : context.params.user.id;
          // context.params.user.id !== context.id && context.params.user._id !== context.id
          if (userId !== context.id) {
            console.log('User is not authorized to access other user details !');
            return Promise.reject(new GeneralError('Unauthorized to access user details'));
          }
  
          return context;
  
        },


      ),
  
  
  
    ],
    create: [
      hashPassword('password'),
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          generate_nanoid, 
          Validation.input(UserSchemas._create),
        ],
        [ /* hooks for internal requests */ ]
      ),
    ],
    update: [ disallow('external') ],
    patch: [ disallow('external') ],
    remove: [ disallow('external') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],   //TODO: Sanitize and validate
    get: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          UserMiddleware.sanitize_user_details,
          Validation.dispatch(UserSchemas._get)
        ],
        [ /* hooks for internal requests */ ]
      ),
    ],
    create: [
      iffElse(isProvider('external'),
        [ /* hooks for external requests (rest/socketio/...) */
          UserMiddleware.sanitize_user_details,
          Validation.dispatch(UserSchemas._created)
        ],
        [ /* hooks for internal requests */ ]
      ),
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
