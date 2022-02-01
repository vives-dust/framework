import { Db } from 'mongodb';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';

// A type interface for our Sensor (it does not validate any data)
interface SensorData {
  _id?: string;
  name: string;
  description?: string;
}

export class Sensors extends Service<SensorData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get('mongoClient');

    client.then(db => {
      this.Model = db.collection('sensors');
    });
  }
}
