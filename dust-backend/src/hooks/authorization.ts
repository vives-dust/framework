import { HookContext } from '@feathersjs/feathers';

/**
 * Check if user is admin and if not throw permission denied error
 */
export const require_admin = async (context: HookContext) => {
  if (context.params.user.role !== 'admin') {
    throw new Error('Permission denied');
  }
  return context;
};
