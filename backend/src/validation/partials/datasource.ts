import Joi from 'joi';
import { TagsSchema, TagsSpecSchema } from './tags';

// TODO: DataSource is very strict for the moment and will only work with the current known data sources (influx)

// Spec is for SensorType where we define the binding between our models
// and the data source representation. Example devId => datasource_key
const DataSourceSpecSchema = Joi.object().keys({
  source: Joi.string().valid('influxdb').required(),
  bucket: Joi.string().valid('dust').required(),
  measurement: Joi.string().valid('dust-sensor', 'weatherstation', 'weatherapi').required(),
  tags: TagsSpecSchema.required(),
  field: Joi.string().required(),
});

// Normal is for Sensor where the key fields are filled with the actual data source value.
const DataSourceSchema = DataSourceSpecSchema.keys({
  tags: TagsSchema.required(),      // We override the specs here
});

export { DataSourceSpecSchema, DataSourceSchema };