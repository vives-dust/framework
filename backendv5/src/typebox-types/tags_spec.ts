import { StringEnum, Type } from '@feathersjs/typebox'

export const TagsSpecSchema = Type.Object({
  devId: Type.Optional(StringEnum(['datasource_key'])),
  stationId: Type.Optional(StringEnum(['datasource_key'])),
}, { minProperties: 1 });
