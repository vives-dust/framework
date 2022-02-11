import { Db } from 'mongodb';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';

interface SoilModelSample {
  raw: number;
  moisture: number;
}

interface SoilModelData {
  _id?: string;
  name: string;
  samples: Array<SoilModelSample>;
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
