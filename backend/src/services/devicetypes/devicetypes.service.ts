// Initializes the `devicetypes` service on path `/devicetypes`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Devicetypes } from './devicetypes.class';
import createModel from '../../models/devicetypes.model';
import hooks from './devicetypes.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'devicetypes': Devicetypes & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/devicetypes', new Devicetypes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('devicetypes');

  service.hooks(hooks);
}
