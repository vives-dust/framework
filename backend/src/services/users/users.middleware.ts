import type { HookContext } from '@feathersjs/feathers';
import { if_not_admin } from '../../hooks/authorization';
import { GeneralError } from '@feathersjs/errors';

export function sanitize_user_details(context: HookContext) {
  context.dispatch = {
    id: context.result.id,
    name: context.result.name,
    email: context.result.email,
    permissions: context.result.permissions,
  };
  // context.dispatch.original = context.result         // For testing/debugging
  return context;
}

export function protect_user_details(context: HookContext) {
  return if_not_admin(
    (context: HookContext) => {
      // Check if request is part of authentication process
      if (!context.params.provider && !context.params.user) return context;
  
      // In other case ID's need to match !
      const userId = context.params.force_mongo_id ? context.params.user._id : context.params.user.id;
      if (userId !== context.id) {
        return Promise.reject(new GeneralError('You are not authorized to access this user\'s details.'));
      }
      return context;
    },
  )(context);
}
