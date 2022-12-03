import Joi from 'joi';

import { ObjectIdSchema } from './partials/objectid';
import { TypePatternSchema } from './partials/type_pattern';
import { UnitSchema } from './partials/unit';

const SensorTypeCreateSchema = Joi.object().keys({
  _id: ObjectIdSchema,
  name: Joi.string().required(),
  type: TypePatternSchema.required(),
  unit: UnitSchema.required(),
  description: Joi.string().required(),
});

export const SensorTypeSchemas = {

  _create: SensorTypeCreateSchema,

};