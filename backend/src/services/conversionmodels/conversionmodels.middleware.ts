import type { HookContext } from '@feathersjs/feathers';

export function sanitize_create_conversionmodel(context: HookContext) {
  context.dispatch = {
    id: context.result.id,
    name: context.result.name,
    description: context.result.description,
    input_unit: context.result.input_unit,
    output_unit: context.result.output_unit,
    samples: context.result.samples,
  };
  //context.dispatch.original = context.result;    // For testing/debugging
  return context;
}