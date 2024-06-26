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

    devicetype_id: { type: Schema.Types.ObjectId, ref: 'devicetypes', required: true },
    sensortype_id: { type: Schema.Types.ObjectId, ref: 'sensortypes', required: true },

    data_source: {
      type: {
        source: { type: String, required: true },
        bucket: { type: String },
        measurement: { type: String },
        tags: { type: Object },
        field: { type: String },
      },
      required: true,
      _id: false
    },
    meta: {
      type: {
        depth: { type: Number },
        // Conversion model set here acts as a default. The sensor instance can overrule this by setting another
        conversion_model_id: { type: Schema.Types.ObjectId, ref: 'conversion_models' },
      },
      required: true,
      _id: false
    }

  }, {
    timestamps: true,
    minimize: false,        // Don't allow mongoose to minimize models by deleting empty objects (meta for example)
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
