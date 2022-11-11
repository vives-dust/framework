import Joi from 'joi';
import { Period } from '../influxdb/query_builder'

const key_values = Object.values(Period);   // First half = labels, second half = numerical value
const valid_periods = key_values.slice(0, key_values.length/2);

const MeasurementQuerySchema = Joi.object().keys({
  bucket: Joi.string(),
  measurement: Joi.string(),
  tags: Joi.object(),
  fields: Joi.array().items(
    Joi.string().required()
  ).min(1),
  drop: Joi.array().items(
    Joi.string().required()
  ).min(1),
  period: Joi.string().valid(...valid_periods),
  start: Joi.string(),
  stop: Joi.string(),
  every: Joi.string(),
  aliases: Joi.object(),
  pruneTags: Joi.boolean()
});

export const MeasurementSchemas = {
  find: MeasurementQuerySchema
};