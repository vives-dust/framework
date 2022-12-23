import { HookContext } from "@feathersjs/feathers";


export function sanitize_create_user(context : HookContext) {
    context.dispatch = {
      id: context.result.id,
      name: context.result.name,
      email: context.result.email,
      permissions: context.result.permissions
    };
    //context.dispatch.original = context.result;    // For testing/debugging
    return context;
  }