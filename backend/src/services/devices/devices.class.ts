import { Id, Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';
import { ModelMapper } from '../soilmodels/model_mapper';

export interface SensorData {
  _time: string;
  value: number;
}

export interface Sensor {
  _id?: string;
  _type: string;
  measurementField: string;            // We need coupling with influx
  values: SensorData[];

  // Moisture Sensor
  depth?: number;
  soilModelId?: string;
}

export interface Device {
  _id: string;
  id: string;
  name: string;
  hardwareId: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    height: number;
  };
  sensors: Sensor[];
}

export class Devices extends Service {
  app: Application;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async get(id: Id, params?: Params): Promise<Device> {
    const device = await super.get(id);

    // Get measurements for each sensor
    const sensors = await Promise.all(device.sensors.map(async (sensor : Sensor) => {
      sensor.values = await this.app.service('measurements').find({
        query: {
          deviceId: device.hardwareId,
          fields: [ sensor.measurementField ],
          drop: ['codingRate'],
          period: params?.query?.period,
          start: params?.query?.start,
          stop: params?.query?.stop,
          every: params?.query?.every,
          aliases: [
            [sensor.measurementField, 'value']
          ],
          pruneTags: true,
        }
      }) as SensorData[];

      if (sensor.soilModelId) {
        const soilModel = await this.app.service('soilmodels').get(sensor.soilModelId);
        ModelMapper.map_moisture_values_to_model(sensor.values, soilModel);
      }

      return sensor;
    }));
    device.sensors = sensors;

    return device;
  }

  async create(data: Partial<any> | Partial<any>[], params?: Params | undefined): Promise<any> {
    
  }
}
