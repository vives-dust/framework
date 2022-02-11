import { Db } from 'mongodb';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { MeasurementDataArray } from '../measurements/measurements.class';
import { ModelMapper } from '../soilmodels/model_mapper';

// A type interface for our Sensor (it does not validate any data)
interface SensorData {
  _id?: string;
  name: string;
  deviceId: string;
  description?: string;
  values?: MeasurementDataArray;
  location?: {
    latitude: number;
    longitude: number;
    height?: number;
  }
  soil_model_id?: string;   // Mandatory ?
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

    if (sensor) {
      // Call moisture service for the moisture data
      sensor.values = await this.app.service('measurements').get(sensor.deviceId, params);

      // Fetch soil model and map values
      if (sensor.soil_model_id) {
        const soilModel = await this.app.service('soilmodels').get(sensor.soil_model_id);
        ModelMapper.map_raw_values_to_model(sensor.values, soilModel);
      }
    }

    return sensor;
  }
  
}
