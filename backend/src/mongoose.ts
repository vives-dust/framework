import mongoose from 'mongoose';
import { Application } from './declarations';
import logger from './logger';

export default function (app: Application): void {
  const config = app.get('mongodb');    // Get config object by key
  const connection = `mongodb://${config.host}:${config.port}/${config.database}`;
  
  mongoose.set('strictQuery', true)

  mongoose.connect(connection, {
    authSource: "admin",
    user: config.root_username,
    pass: config.root_password
  })
  .catch(err => {
    console.log("Failed to connect to mongodb")
    logger.error(err);
    process.exit(1);
  });

  app.set('mongooseClient', mongoose);
}
