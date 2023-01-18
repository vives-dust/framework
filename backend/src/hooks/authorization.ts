import * as feathersAuthentication from '@feathersjs/authentication';
import { iff, iffElse } from 'feathers-hooks-common';
import checkPermissions from 'feathers-permissions';
import { Hook, HookContext } from '@feathersjs/feathers';
import { hooks } from '@feathersjs/commons';
const { processHooks } = hooks;
const { authenticate } = feathersAuthentication.hooks;

// Use as ...required_admin
export const require_admin = [
  // authenticate('jwt'),        // TODO: This does not belong here. It's authentication and not authorization
  checkPermissions({ roles: ['admin'] }),
];

// Use as ...check_if_admin
export const check_if_admin = [
  authenticate('jwt'),        // TODO: This does not belong here. It's authentication and not authorization
  checkPermissions({ roles: [ 'admin' ], error: false }),
];

export function if_not_admin(...serviceHooks: Hook[]): Hook {
  // return if_admin_else(undefined, serviceHooks);

  return function (this: any, context: any) {
    return processHooks.call(this, [
      checkPermissions({ roles: [ 'admin' ], error: false }),
      iff((context: HookContext) => !context.params.permitted,
        ...serviceHooks,
      ),
    ], context);
  };
}

export function if_admin_else(trueHooks: Hook | Hook[] | undefined, falseHooks?: Hook | Hook[] | undefined): Hook {
  return function (this: any, context: any) {
    return processHooks.call(this, [
      checkPermissions({ roles: [ 'admin' ], error: false }),
      iffElse((context: HookContext) => context.params.permitted,
        trueHooks,
        falseHooks
      ),
    ], context);
  };
}
