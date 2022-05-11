import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';

export interface SoilModelSample {
  raw: number;
  moisture: number;
}

export interface SoilModel {
  _id?: string;
  name: string;
  samples: SoilModelSample[];
}

export class Soilmodels extends Service<SoilModel> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }
}
