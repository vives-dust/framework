
import { AdapterService, ServiceOptions } from '@feathersjs/adapter-commons';
import { Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';

export interface MoistureSample {
  level_1: number;
  level_2: number;
  level_3: number;
  level_4: number;
  temperature: number;
  time: number;
}

export class Moisture extends AdapterService {
  app: Application;
  
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<ServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  find(params?: Params): Promise<MoistureSample[]> {
    // TODO: Abstract db-queries
    // Maybe custom DB adapter ?
    let query = '';
    switch (params?.query?.values){
    case 'all': query = `
      SELECT
      internalTemperature as temperature,
      moistureLevel_1 as level_1,
      moistureLevel_2 as level_2,
      moistureLevel_3 as level_3,
      moistureLevel_4 as level_4
      FROM tph`; break;
    // 'last' = default
    default: query = `
      SELECT
      last(internalTemperature) as temperature,
      last(moistureLevel_1) as level_1,
      last(moistureLevel_2) as level_2,
      last(moistureLevel_3) as level_3,
      last(moistureLevel_4) as level_4
      FROM tph`; break;
    }

    query += ' where devId=$devId';
    return this.app.get('influxClient').query(query, { placeholders: { devId: params?.query?.deviceId } });
  }
}
