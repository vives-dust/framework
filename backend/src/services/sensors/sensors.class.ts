import { Db } from 'mongodb';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';
import { Measurement } from '../measurements/measurements.class';

export interface Sensor {
  _id?: string;
  type: string;
  deviceId: string;
  field: string;            // We need coupling with influx
}

export interface SensorData extends Sensor, Measurement {}

export class Sensors extends Service<Sensor> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get('mongoClient');

    client.then(db => {
      this.Model = db.collection('sensors');
    });
  }

}
