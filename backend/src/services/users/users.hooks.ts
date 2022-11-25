import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import checkPermissions from 'feathers-permissions';
import { generate_nanoid } from '../../hooks/nanoid';
import { generate_permissions } from '../../hooks/user_permissions';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt')],
    create: [ generate_nanoid, generate_permissions, hashPassword('password') ],
    update: [ checkPermissions({
      roles: [ "Admin" ]
    }), 
    hashPassword('password'), authenticate('jwt') ],
    patch: [ checkPermissions({
      roles: [ "Admin" ]
    }), 
    hashPassword('password'), authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
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
