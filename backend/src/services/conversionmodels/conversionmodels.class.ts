import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';

export interface ConversionModelSample {
  raw: number;
  value: number;
}

export interface ConversionModel {
  _id?: string;
  name: string;
  description: string;
  input_unit: string;
  output_unit: string;
  samples: {
    type: [ConversionModelSample]
  };
}

export class Conversionmodels extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }
}
