// Initializes the `sensortypes` service on path `/sensortypes`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Sensortypes } from './sensortypes.class';
import createModel from '../../models/sensortypes.model';
import hooks from './sensortypes.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'sensortypes': Sensortypes & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sensortypes', new Sensortypes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sensortypes');

  service.hooks(hooks);
}
