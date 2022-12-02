import { Id, Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';

export class Trees extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }

  async get(id: Id, params: Params) {
    // Internal request uses mongodb _id
    if (!params.provider) {   
      return super.get(id, params);
    }

    // External request (REST / SocketIO) uses nanoid id
    // Need to return single object from find() here
    params = params || {};
    params.query = params.query || {};
    params.query.$limit = 1;
    params.query.id = id;    // Use the nanoid id
    return super.find(params).then(function (result : any) {
      const data = result.data || result;
      return Array.isArray(data) ? data[0] : data;
    });
  }
}
