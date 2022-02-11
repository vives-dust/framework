// Initializes the `soilmodels` service on path `/soilmodels`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Soilmodels } from './soilmodels.class';
import hooks from './soilmodels.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'soilmodels': Soilmodels & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/soilmodels', new Soilmodels(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('soilmodels');

  service.hooks(hooks);
}
