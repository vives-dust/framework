import { MongoClient } from 'mongodb';
import { Application } from './declarations';

export default function (app: Application): void {
  const config = app.get('mongodb');
  const connection = `mongodb://${config.host}:${config.port}/${config.database}`;
  const mongoClient = MongoClient.connect(connection)
    .then(client => client.db(config.database));

  app.set('mongoClient', mongoClient);
}
