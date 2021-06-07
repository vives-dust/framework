
import { errors, MethodNotAllowed, NotAuthenticated } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import Influx, { InfluxDB } from 'influx';


interface Data {}

interface ServiceOptions {}

export class Measurements implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<Data> {
    const Sensors = this.app.service('sensors');
    const sensor = await Sensors.get( id );
    const period = params!.query!.period as string;

    const properties = ['battery', 'temperature', 'pressure', 'humidity', 'rssi'];
    const propertiesMean = properties.map( prop => `mean(${prop}) as ${prop}`);
    const periodQueryMap = {
      'last': `SELECT ${properties.join(', ')} FROM tph WHERE devId = '${sensor.deviceId}' ORDER BY time DESC LIMIT 1`,
      '1h': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId = '${sensor.deviceId}' AND time > now() - 1h GROUP BY time(1m) fill(linear)`,
      '24h': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId = '${sensor.deviceId}' AND time > now() - 24h GROUP BY time(5m) fill(linear)`,
      '7d': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId = '${sensor.deviceId}' AND time > now() - 7d GROUP BY time(30m) fill(linear)`,
      '31d': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId = '${sensor.deviceId}' AND time > now() - 30d GROUP BY time(2h) fill(linear)`,
      '1y': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId = '${sensor.deviceId}' AND time > now() - 1Y GROUP BY time(24h) fill(linear)`,
      'all': `SELECT ${propertiesMean.join(', ')} FROM tph WHERE devId = '${sensor.deviceId}' GROUP BY time(24h) fill(linear)`,
    };

    // console.log('period:', period);
    if (sensor) {
      const host = 'localhost';
      const port = 8086;
      const database = 'default';
      const influx = new InfluxDB( { host, port, database });
      const query = periodQueryMap[period as keyof typeof periodQueryMap];
      // console.log(query);
      const data: any = await influx.query(query);
      return data;
    } else {
      return errors.NotFound;
      return {msg: 'error' };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    // this.app.service('sensors').publish( (data: any) => {
    //   return [
    //     (this.app as any).channel(`userIds/${data.createdBy}`),
    //   ];
    // });

    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    throw new MethodNotAllowed();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Data> {
    throw new MethodNotAllowed();
  }
}
