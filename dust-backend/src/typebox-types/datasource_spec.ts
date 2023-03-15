import { StringEnum, Type } from '@feathersjs/typebox'
import { TagsSpecSchema } from './tags_spec';

export const DataSourceSpecSchema = Type.Object({
  source: StringEnum(['influxdb']),
  bucket: StringEnum(['dust']),
  measurement: StringEnum(['dust-sensor', 'weatherstation', 'weatherapi']),
  tags: TagsSpecSchema,
  field: Type.String(),
});
