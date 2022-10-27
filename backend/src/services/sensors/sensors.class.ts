import { Id, Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';

export class Sensors extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }

  find_by_device_id(id : Id) {
    return this.find({ query: {
      device_id: id,
      $populate: ['device_id', 'sensortype_id']
    }});
  }

}
