import { default as feathers, HookContext } from '@feathersjs/feathers';

export function pre_populate_relations(context: HookContext) {
  const query = Object.assign(context.params.query || {}, { $populate: ['device_id', 'sensortype_id'] });
  context.params.query = query;

  return context;
}

export async function populate_last_value(context : HookContext) {
  context.result.last_value = (await context.app.service('measurements').find({
    query: {
      bucket: context.result.data_source.bucket,
      measurement: context.result.data_source.measurement,
      tags: context.result.data_source.tags,
      drop: ['codingRate'],   // FIX: For duplicate series
      fields: [ context.result.data_source.field ],
      aliases: {
        [context.result.data_source.field]: 'value',
        '_time': 'time',
      },
      pruneTags: true,
    }
  }))[0];

  return context;
}

export function sanitize_single_sensor(context : HookContext) {

  context.dispatch = {
    id: context.result.id,
    name: context.result.name,
    tree_id: context.result.device_id.tree_id,
    tree_url: `https://dust.devbitapp.be/api/trees/${context.result.device_id.tree_id}`,      // TODO: Replace with ENV var
    type: context.result.sensortype_id.type,
    description: context.result.sensortype_id.description,
    last_value: context.result.last_value || {},
    values: context.result.values,
    unit: context.result.sensortype_id.unit,
    meta: context.result.meta,
  }

  return context;
}
