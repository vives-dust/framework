import { Db } from 'mongodb';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { MoistureSample } from '../moisture/moisture.class';

// A type interface for our Sensor (it does not validate any data)
interface SensorData {
  _id?: string;
  name: string;
  deviceId: string;
  description?: string;
  values?: MoistureSample[];
}

export class Sensors extends Service<SensorData> {
  app: Application;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);
    this.app = app;

    const client: Promise<Db> = app.get('mongoClient');

    client.then(db => {
      this.Model = db.collection('sensors');
    });
  }

  async get(id: Id, params?: Params): Promise<SensorData> {
    const sensor = await super.get(id);

    // Call moisture service for the moisture data
    if (sensor) {
      sensor.values = await this.app.service('moisture').find({
        query: {
          values: params?.query?.values,
          deviceId: sensor.deviceId
        }
      });
    }

    return sensor;
  }
  
}
