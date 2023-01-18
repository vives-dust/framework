import * as feathersAuthentication from '@feathersjs/authentication';
import { iff } from 'feathers-hooks-common';
import checkPermissions from 'feathers-permissions';
import { Hook, HookContext } from '@feathersjs/feathers';
import { hooks } from '@feathersjs/commons';
const { processHooks } = hooks;
const { authenticate } = feathersAuthentication.hooks;

export const require_admin = [
  authenticate('jwt'),        // TODO: This does not belong here. It's authentication and not authorization
  checkPermissions({ roles: ['admin'] }),
];

export const check_if_admin = [
  authenticate('jwt'),        // TODO: This does not belong here. It's authentication and not authorization
  checkPermissions({ roles: [ 'admin' ], error: false }),
];

export function if_not_admin(...serviceHooks: Hook[]): Hook {
  return function (this: any, context: any) {
    return processHooks.call(this, [
      checkPermissions({ roles: [ 'admin' ], error: false }),
      iff((context: HookContext) => !context.params.permitted,
        ...serviceHooks,
      ),
    ], context);
  };
}
