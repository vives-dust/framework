import { Db } from 'mongodb';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';

interface SensorData {
  _id?: string;
  userId: string;
  name: string;
  deviceId: string;
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
    height?: number;
  }
}

export class Sensors extends Service<SensorData> {
  
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get('mongoClient');

    client.then(db => {
      this.Model = db.collection('sensors');
    });
  }
}
