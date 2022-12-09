import Joi from 'joi';

// TODO: Tags is very strict for the moment and will only work with the current sensors/devices

// Tags Spec is for SensorType where we define the binding between our models
// and the data source representation. Example devId => datasource_key
const TagsSpecSchema = Joi.object().keys({
  devId: Joi.string().valid('datasource_key'),
  stationId: Joi.string().valid('datasource_key'),
}).min(1);

// Tags is for Sensor where the key fields are filled with the actual data source value.
const TagsSchema = Joi.object().keys({
  devId: Joi.string(),
  stationId: Joi.string(),
}).min(1);

export { TagsSpecSchema, TagsSchema };