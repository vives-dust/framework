import { Id, NullableId, Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';

interface UserData {
  id: string;
  email: string;
  password: string;
  name?: string;
  permissions: Array<string>;
}

export class Users extends Service<UserData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongooseServiceOptions>, app: Application) {
    super(options);
  }

  async patch(id: Id, data: Partial<UserData>, params?: Params): Promise<UserData | UserData[]> {
  //   // Internal request uses mongodb _id
    if (!params.provider) {   
      return super.patch(id, data, params);
    }

    // External request (REST / SocketIO) uses nanoid id
    // Need to return single object from find() here
    params = params || {};
    params.query = params.query || {};
    params.query.$limit = 1;
    params.query.id = id;    // Use the nanoid id
    return super.patch(await this.get(id, params), data, params);
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

  create (data: UserData, params?: Params) {
    // Information we want on creation of the user
    const { id, email, password, name, permissions} = data;

    // The complete user
    const userData = {
      id,
      email,
      password,
      name,
      permissions
    };

    // Call the original `create` method with existing `params` and new data
    return super.create(userData, params)
  };
}
