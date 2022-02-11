import { Db } from 'mongodb';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';

export interface SoilModelMoistureSample {
  raw: number;
  moisture: number;
}

export interface SoilModelData {
  _id?: string;
  name: string;
  samples: Array<SoilModelMoistureSample>;
}

export class Soilmodels extends Service<SoilModelData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get('mongoClient');

    client.then(db => {
      this.Model = db.collection('soilmodels');
    });
  }
}
