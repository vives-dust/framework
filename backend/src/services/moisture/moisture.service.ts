// Initializes the `moisture` service on path `/moisture`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Moisture } from './moisture.class';
import hooks from './moisture.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'moisture': Moisture & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/moisture', new Moisture(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('moisture');

  service.hooks(hooks);
}
