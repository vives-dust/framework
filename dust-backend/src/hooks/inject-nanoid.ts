import { nanoid } from 'nanoid/async';
import type { HookContext } from '../declarations'

export async function inject_nano_id(context : HookContext) : Promise<HookContext> {
  context.data = {
    ...context.data,
    _id: await nanoid(),
  }
  return context;
}
