import { MethodNotAllowed } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';

export interface MeasurementData {
  temperature?: number;
  level_1?: number;
  level_2?: number;
  level_3?: number;
  level_4?: number;
}

export interface MeasurementDataEnum extends Array<MeasurementData>{}

interface ServiceOptions {}

export class Measurements implements ServiceMethods<MeasurementDataEnum> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<MeasurementDataEnum[] | Paginated<MeasurementDataEnum>> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<MeasurementDataEnum> {
    // id = deviceId here

    const period = params?.query?.period as string || 'last';
    console.log(period);
    console.log(id);

    // TODO: Abstract db-queries

    const properties = [
      // field, alias
      ['internalTemperature', 'temperature'],
      ['moistureLevel_1', 'level_1'],
      ['moistureLevel_2', 'level_2'],
      ['moistureLevel_3', 'level_3'],
      ['moistureLevel_4', 'level_4'],
    ];
      
    const propertiesSingle = properties.map( prop => `${prop[0]} as ${prop[1]}`);
    const propertiesMean = properties.map( prop => `mean(${prop[0]}) as ${prop[1]}`);
    const periodQueryMap = {
      'last': `SELECT ${propertiesSingle.join(', ')} FROM tph WHERE devId=$devId ORDER BY time DESC LIMIT 1`,
      '1h': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId=$devId AND time > now() - 1h GROUP BY time(1m) fill(linear)`,
      '24h': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId=$devId AND time > now() - 24h GROUP BY time(5m) fill(linear)`,
      '7d': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId=$devId AND time > now() - 7d GROUP BY time(30m) fill(linear)`,
      '31d': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId=$devId AND time > now() - 30d GROUP BY time(2h) fill(linear)`,
      '1y': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId=$devId AND time > now() - 1Y GROUP BY time(24h) fill(linear)`,
      'all': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId=$devId GROUP BY time(24h) fill(linear)`,
    };

    return this.app.get('influxClient').query(periodQueryMap[period as keyof typeof periodQueryMap], { placeholders: { devId: id } });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: MeasurementDataEnum, params?: Params): Promise<MeasurementDataEnum> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: MeasurementDataEnum, params?: Params): Promise<MeasurementDataEnum> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: MeasurementDataEnum, params?: Params): Promise<MeasurementDataEnum> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<MeasurementDataEnum> {
    throw new MethodNotAllowed();
  }
}
