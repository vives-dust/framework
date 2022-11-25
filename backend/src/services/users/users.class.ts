import { Params } from '@feathersjs/feathers';
import { Service, MongooseServiceOptions } from 'feathers-mongoose';
import { Application } from '../../declarations';

interface UserData {
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

  create (data: UserData, params?: Params) {
    // Information we want on creation of the user
    const { email, password, name, permissions} = data;

    // The complete user
    const userData = {
      email,
      password,
      name,
      permissions
    };

    console.log("Dit zijn de params: ", params)

    // Call the original `create` method with existing `params` and new data
    return super.create(userData, params)
  };
}
