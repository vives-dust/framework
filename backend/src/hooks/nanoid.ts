import { nanoid } from 'nanoid/async';
import { default as feathers, HookContext } from '@feathersjs/feathers';

export async function generate_nanoid(context : HookContext) {
    context.data.id = await nanoid();
    return context;
  }