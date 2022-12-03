import Joi from 'joi';

// TODO: DataSource is very strict for the moment
const DataSourceSchema = Joi.object().keys({
  source: Joi.string().valid('influxdb').required(),
  bucket: Joi.string().valid('dust').required(),
  measurement: Joi.string().valid('dust-sensor', 'weatherstation', 'weatherapi').required(),
  tags: Joi.object().keys({
    // TODO: Again, very strict for the moment.
    devId: Joi.string().valid('datasource_key'),
    stationId: Joi.string().valid('datasource_key'),
  }).min(1).required(),
  field: Joi.string().required(),
});

export { DataSourceSchema };