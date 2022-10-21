// trees-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'trees';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const treeSchema = new Schema({

    id: { type: String, required: true, immutable: true },   // TODO: nanoid ID
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: {
        latitude: { type: Number, required: true },
        longitude:  { type: Number, required: true },
        height: { type: Number, required: true }
      },
      required: true,
      _id: false
    },
    image_url: { type: String, required: true },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, treeSchema);
}
