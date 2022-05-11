// devices-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import mongoose, { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'devices';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  // Parent SensorSchema that defines common props for sensors
  const sensorSchema = new Schema({
    measurementField: { type: String, required: true }
  }, {
    timestamps: false,
    discriminatorKey: '_type',
  });

  // Schema for a Device that contains SubDocs of Sensors
  const deviceSchema = new Schema({
    name: { type: String, required: true },
    hardwareId: { type: String, required: true },
    description: { type: String, required: false },
    location: {
      type: {
        latitude: { type: Number, required: true },
        longitude:  { type: Number, required: true },
        height: { type: Number, required: false }
      },
      required: true
    },
    sensors: [ sensorSchema ]
  }, {
    timestamps: true
  });

  const sensorArrayType = deviceSchema.path('sensors') as mongoose.Schema.Types.DocumentArray;

  // Now we need to define the schema's for the different types of sensors
  const soilMoistureSensorSchema = new Schema({
    depth: { type: Number, required: true },
    soilModelId: { type: String, required: false },     // TODO: FIX TO REF !
  });
  sensorArrayType.discriminator('moisture', soilMoistureSensorSchema);

  const temperatureSensorSchema = new Schema({
  });
  sensorArrayType.discriminator('temperature', temperatureSensorSchema);

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, deviceSchema);
}
