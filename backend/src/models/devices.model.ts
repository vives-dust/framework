// devices-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'devices';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const schema = new Schema({

    id: { type: String, required: true, immutable: true },   // TODO: nanoid ID
    tree_id: { type: Schema.Types.ObjectId, ref: 'trees', required: true },
    devicetype_id: { type: Schema.Types.ObjectId, ref: 'devicetypes', required: true },
    // Hardware ID is a hardware specific ID. For example for DUST devices it is a serial number
    hardware_id: { type: String, required: false },
    // The key identification of the device in the data source. For example for DUST device this is EUI
    datasource_key: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },

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
