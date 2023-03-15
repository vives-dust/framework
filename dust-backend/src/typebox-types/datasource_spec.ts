import { StringEnum, Type } from '@feathersjs/typebox'

// TODO: Tags is very strict for the moment and will only work with the current sensors/devices

// Tags Spec is for SensorType where we define the binding between our models
// and the data source representation. Example devId => datasource_key
export const TagsSpecSchema = Type.Object({
  devId: Type.Optional(StringEnum(['datasource_key'])),
  stationId: Type.Optional(StringEnum(['datasource_key'])),
}, { minProperties: 1 });

// Tags is for Sensor where the key fields are filled with the actual data source value.
export const TagsSchema = Type.Object({
  devId: Type.Optional(Type.String()),        // For example eui-xxxxxxxxxx
  stationId: Type.Optional(Type.String())     // For example garni-station-ostend
}, { minProperties: 1 });


// TODO: DataSource is very strict for the moment and will only work with the current known data sources (influx)

// Spec is for SensorType where we define the binding between our models
// and the data source representation. Example devId => datasource_key
export const DataSourceSpecSchema = Type.Object({
  source: StringEnum(['influxdb']),
  bucket: StringEnum(['dust']),
  measurement: StringEnum(['dust-sensor', 'weatherstation', 'weatherapi']),
  tags: TagsSpecSchema,
  field: Type.String(),
});

// Normal is for Sensor where the key fields are filled with the actual data source value.
export const DataSourceSchema = Type.Union([
  DataSourceSpecSchema,
  Type.Object({
    tags: TagsSchema,       // We override the specs here
  })
])
