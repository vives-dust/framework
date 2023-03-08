import type { HookContext } from '../declarations'

export async function set_timestamps(context : HookContext) : Promise<HookContext> {
  context.data = {
    ...context.data,
    updatedAt: new Date(),
    ...(context.method === 'create' ? { createdAt: new Date() } : {})
  }
  return context;
}
