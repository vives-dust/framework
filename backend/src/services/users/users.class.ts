import { Id, NullableId, Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';

export class Users extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }

  async get(id: Id, params: Params) {
    // Internal request uses mongodb _id
    if ((!params.provider || params.force_mongo_id) && !params.force_nanoid_id) {   
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

  async remove(id: NullableId, params?: Params) {
    // Internal request uses mongodb _id
    if ((!params.provider || params.force_mongo_id) && !params.force_nanoid_id) {   
      return super.remove(id, params);
    }

    return this.get(id, params).then(function (result : any) {
      const data = result.data || result;
      return Array.isArray(data) ? data[0] : data;
    }).then((user) => {
      return super.remove(user._id, params);
    });
  }
}
