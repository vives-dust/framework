import * as feathersAuthentication from '@feathersjs/authentication';
import checkPermissions from 'feathers-permissions';

const { authenticate } = feathersAuthentication.hooks;

export const require_admin = [
  authenticate('jwt'),
  checkPermissions({ roles: ['admin'] }),
];
