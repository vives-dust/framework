import Joi from 'joi';

const name = Joi.string();
const hardwareId = Joi.string();
const description = Joi.string();
const location = Joi.object().keys({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  height: Joi.number()
});

const sensor_type = Joi.string().valid('temperature', 'moisture');
const measurementField = Joi.string();

const depth = Joi.when('_type', { is: 'moisture', then: Joi.number().required(), otherwise: Joi.forbidden() })
const soildModelId = Joi.when('_type', { is: 'moisture', then: Joi.string(), otherwise: Joi.forbidden() });

const sensors = Joi.array().min(1).items(
  Joi.object().keys({
    _type: sensor_type.required(),
    measurementField: measurementField.required(),
  
    depth: depth,
    soilModelId: soildModelId,
  })
);

const CreateDeviceSchema = Joi.object().keys({
  name: name.required(),
  hardwareId: hardwareId.required(),
  description: description,
  location: location.required(),
  sensors: sensors.required()
});

const UpdateDeviceSchema = Joi.object().keys({
  id: id.required(),
  name: name.required(),
  hardwareId: hardwareId.required(),
  description: description,
  location: location.required(),
  sensors: sensors.required()
});

const PatchDeviceSchema = Joi.object().keys({
  id: id,
  name: name,
  hardwareId: hardwareId,
  description: description,
  location: location,
  sensors: sensors
});

export const DeviceSchemas = {
  create: CreateDeviceSchema,
  update: UpdateDeviceSchema,
  patch: PatchDeviceSchema,
};