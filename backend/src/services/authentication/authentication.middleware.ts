import type { HookContext } from '@feathersjs/feathers';

export function sanitize_authentication_reply(context: HookContext) {
  context.dispatch = {
    accessToken: context.result.accessToken,
    authentication: context.result.authentication,
    user: {
      id: context.result.user.id,
      name: context.result.user.name,
      email: context.result.user.email,
      permissions: context.result.user.permissions,
    }
  };
  // context.dispatch.original = context.result         // For testing/debugging
  return context;
}

export function force_mongo_id_usage(context: HookContext) {
  context.params.force_mongo_id = true;
  return context;
}
