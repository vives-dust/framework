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

    id: { type: String, required: true, immutable: true },   // TODO: nanoid ID
    name: { type: String, required: true },
    device_id: { type: Schema.Types.ObjectId, ref: 'devices', required: true },
    sensortype_id: { type: Schema.Types.ObjectId, ref: 'sensortypes', required: true },
    meta: { type: Object, required: true },
    data_source: {
      type: {
        source: { type: String, required: true },
        bucket: { type: String },
        field: { type: String },
      },
      required: true,
      _id: false
    },

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
