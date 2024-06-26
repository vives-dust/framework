// sensors-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'sensors';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const schema = new Schema({

    id: { type: String, required: true, immutable: true },
    name: { type: String, required: true },
    device_id: { type: Schema.Types.ObjectId, ref: 'devices', required: true },
    sensortype_id: { type: Schema.Types.ObjectId, ref: 'sensortypes', required: true },
    meta: {
      type: {
        depth: { type: Number },
        // Conversion model set here acts as a specific conversion model for this sensor.
        // This overrules the initial conversion model from sensor_type
        conversion_model_id: { type: Schema.Types.ObjectId, ref: 'conversion_models' },
      },
      required: true,
      _id: false
    },
    data_source: {
      type: {
        source: { type: String, required: true },
        bucket: { type: String },
        measurement: { type: String },
        // Tags will be unique identifier used for filtering
        // For dust device it is devId, but other devices may have other
        // identifier
        tags: { type: Object },
        field: { type: String },
      },
      required: true,
      _id: false
    },

  }, {
    timestamps: true,
    minimize: false,
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
