// devicesensors-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'devicesensors';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({

    device_id: { type: Schema.Types.ObjectId, ref: 'devices', required: true },
    sensor_id: { type: Schema.Types.ObjectId, ref: 'sensors', required: true },

    data_source: { type: {
      source: { type: String, required: true },
      bucket: { type: String },
      field: { type: String },
    }, required: true },
    depth: { type: Number },
    conversion_model_id: { type: Schema.Types.ObjectId, ref: 'conversion_models', required: true },

  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
