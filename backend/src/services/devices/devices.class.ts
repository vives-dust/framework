import { Db } from 'mongodb';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { Sensor, SensorData } from '../sensors/sensors.class';
import { Measurement } from '../measurements/measurements.class';
import { ModelMapper } from '../soilmodels/model_mapper';

interface Device {
  _id?: string;
  name: string;
  hardwareId: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    height: number;
  },
  sensors?: Array<Sensor>;
  soilModelId?: string
}

export class Devices extends Service<Device> {
  app: Application;
  
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);
    this.app = app;

    const client: Promise<Db> = app.get('mongoClient');

    client.then(db => {
      this.Model = db.collection('devices');
    });
  }

  async get(id: Id, params?: Params): Promise<Device> {
    const device = await super.get(id);

    device.sensors = await this.app.service('sensors').find({ query: { deviceId: id } }) as Array<Sensor>;
    const influxFields = device.sensors.map(d => d.field);

    // Allow indexing of meta-data using influxField
    const sensorMetaData: any = {};
    device.sensors.forEach(d => { sensorMetaData[d.field] = d; });

    // Setup params for querying measurements
    const measurementParams = params || {};
    measurementParams.query = Object.assign(params?.query || {}, { fields: influxFields });
    const measurements = await this.app.service('measurements').get(device.hardwareId, measurementParams);

    // Join the measurements for each sensor with its meta-data
    const sensorData : SensorData[] = measurements.map((m : Measurement) => Object.assign(m, sensorMetaData[m.field])) as SensorData[];

    if (device.soilModelId) {
      const soilModel = await this.app.service('soilmodels').get(device.soilModelId);
      ModelMapper.map_moisture_values_to_model(sensorData, soilModel);
    }

    device.sensors = sensorData;

    return device;
  }
}
