import { Params, ServiceAddons } from '@feathersjs/feathers';
import { AuthenticationBaseStrategy, AuthenticationRequest, AuthenticationResult, AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth } from '@feathersjs/authentication-oauth';

import { Application } from './declarations';

declare module './declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}


class MyAuthService extends AuthenticationService {
  // async getPayload(authResult: any, params: any) {
  //   // Call original `getPayload` first
  //   const payload = await super.getPayload(authResult, params);
  //   const { user } = authResult;

  //   if (user && user.permissions) {
  //     payload.permissions = user.permissions;
  //   }

  //   console.log(authResult, params, payload, user);

  //   return payload;
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async authenticate (data: AuthenticationRequest, params: Params) {
    console.log('*******************************');
    return {
      authentication: { strategy: 'hello' },
    };
  }
}

class AnonymousStrategy extends AuthenticationBaseStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async authenticate(authentication: AuthenticationResult, params: Params) {
    return {
      anonymous: true
    };
  }
}


export default function(app: Application): void {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('api-key', new MyAuthService(app, 'api-key', {}));
  authentication.register('anonymous', new AnonymousStrategy());
  // authentication.register('my-local', new MyLocalStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
}
