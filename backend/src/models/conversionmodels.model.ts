// conversionmodels-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'conversionmodels';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;


  const conversionSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    input_unit: { type: String, required: true },
    output_unit: { type: String, required: true },
    samples: { 
      type: [
        {
          raw: { type: Number, required: true },
          moisture: { type: Number, required: true }
        }
      ],
      required: true,
      _id: false    // Don't generate _id fields for subdocument
    }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, conversionSchema);
}
