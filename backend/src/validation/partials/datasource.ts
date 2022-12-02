import Joi from 'joi';

// TODO: Datasource is very strict for the moment
const DataSourceSchema = Joi.object().keys({
  source: Joi.string().valid('influxdb').required(),
  bucket: Joi.string().valid('dust').required(),
  measurement: Joi.string().valid('dust-sensor', 'weatherstation', 'weatherapi').required(),
  tags: Joi.object().keys({
    // We don't know so we allow all (unknown())
  }).unknown().min(1),
  field: Joi.string().required(),
});

export { DataSourceSchema }