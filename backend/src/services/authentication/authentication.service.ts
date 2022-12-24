import { HookContext, HooksObject, Params, ServiceAddons } from '@feathersjs/feathers';
import { AuthenticationResult, AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth } from '@feathersjs/authentication-oauth';
import { Application } from '../../declarations';
import hooks from './authentication.hooks';

import { debug } from 'feathers-hooks-common';

declare module '../../declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}

export class CustomAuthenticationService extends AuthenticationService {

  constructor(app: Application, configKey?: string, options?: {}) {
    super(app, configKey, options);
  }

  async getTokenOptions(authResult: AuthenticationResult, params: Params): Promise<any> {
    const payload = await super.getTokenOptions(authResult, params);
    const { user } = authResult;

    if (user) {
      payload.subject = user.id;      // Use the nanoid instead of the mongo id
    }
    return payload;
  }
}

class CustomJwtStrategy extends JWTStrategy {

  constructor() {
    super();
  }

  async getEntity (id: string, params: Params) {
    return super.getEntity(id, Object.assign({}, params, { force_nanoid_id: true }));
  }
}

export default function(app: Application): void {
  const authentication = new CustomAuthenticationService(app);

  authentication.register('jwt', new CustomJwtStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());

  const service = app.service('authentication');
  service.hooks(hooks);
}
