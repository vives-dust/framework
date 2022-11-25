import { default as feathers, HookContext } from '@feathersjs/feathers';

export async function generate_permissions(context : HookContext) {
  context.data.permissions = [ "User" ];
  return context;
}