import type { HookContext } from '@feathersjs/feathers';

export function sanitize_created_user(context: HookContext) {
  context.dispatch = {
    id: context.result.id,
    name: context.result.name,
    email: context.result.email,
  };
  // context.dispatch.original = context.result         // For testing/debugging
  return context;
}

export function sanitize_get_user(context: HookContext) {
  context.dispatch = {
    id: context.result.id,
    name: context.result.name,
    email: context.result.email,
  };
  // context.dispatch.original = context.result         // For testing/debugging
  return context;
}