// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { MongoClient } from 'mongodb'
import type { Db } from 'mongodb'
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    mongodbClient: Promise<Db>
  }
}

export const mongodb = (app: Application) => {
  const config = app.get('mongodb_custom') as any
  const connection = `mongodb://${config.host}:${config.port}`;
  
  const mongoClient = MongoClient.connect(connection, {
    auth: { username: config.root_username, password: config.root_password }
  }).then((client) => client.db(config.database))

  app.set('mongodbClient', mongoClient)
}
