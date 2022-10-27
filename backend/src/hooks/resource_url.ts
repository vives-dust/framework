import { default as feathers, HookContext } from '@feathersjs/feathers';

const generate_resource_url = (context : HookContext, id : string) => `${context.app.get('application').domain}/${context.path}/${id}`;

export function set_resource_url(context : HookContext) {
  const resource = context.path.endsWith('s') ? context.path.slice(0, -1) : context.path;
  const data = context.result.data || context.result;

  if (Array.isArray(data)) {
    data.forEach((element) => element[`${resource}_url`] = generate_resource_url(context, element.id));
  } else {
    data[`${resource}_url`] = generate_resource_url(context, data.id);
  }

  context.result = data;
  return context;
}